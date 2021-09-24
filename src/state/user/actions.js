/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import gravatar from 'gravatar';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  getStorage, ref, getDownloadURL,
} from 'firebase/storage';

import { db } from '../../firebase';

import defaultAvatarPng from '../../assets/default-avatar.png';

import {
  SET_USER_STATE,
  SET_PUBLIC_PROFILE,
  CLEAR_USER_STATE,
} from '../../constants/actions';

import {
  requestUpdateAuthJson,
} from '../../senders';

export const clearUserState = () => (dispatch) => {
  dispatch(({
    type: CLEAR_USER_STATE,
  }));
  requestUpdateAuthJson();
};

export const updateUserState = (updatedState) => ({
  type: SET_USER_STATE,
  updatedState,
});

export const setPublicProfile = (publicProfile) => (dispatch) => {
  if (!publicProfile) return;

  const { currentUser } = getAuth();
  if (publicProfile.billingPlan) {
    window.localStorage.setItem(`billingPlan-${currentUser.uid}`, publicProfile.billingPlan);
  } else {
    window.localStorage.removeItem(`billingPlan-${currentUser.uid}`);
  }

  dispatch({
    type: SET_PUBLIC_PROFILE,
    publicProfile,
  });
};

export const updateUserAsync = () => async (dispatch, getState) => {
  const { currentUser } = getAuth();
  const currentUserState = getState().user;

  if (!currentUser) return Promise.resolve();

  dispatch(updateUserState({
    isSignedIn: true,
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUserState.photoURL
      || currentUser.photoURL
      || gravatar.url(currentUser.email, { s: '192', r: 'pg', d: 'retro' }, true)
      || defaultAvatarPng,
    providerData: currentUser.providerData,
    publicProfile: {
      ...currentUserState.publicProfile,
      billingPlan: window.localStorage.getItem(`billingPlan-${currentUser.uid}`) || 'basic',
    },
  }));

  // Update auth.json
  Promise.resolve()
    .then(() => {
      if (!currentUserState.authToken) {
        return httpsCallable(getFunctions(), 'getLongtermAuthToken')()
          .then((result) => result.data.token);
      }
      return currentUserState.authToken;
    })
    .then((authToken) => {
      dispatch(updateUserState({ authToken }));
      requestUpdateAuthJson({
        uid: currentUser.uid,
        authToken,
      });
    })
    // eslint-disable-next-line no-console
    .catch(console.log);

  return Promise.resolve()
    .then(async () => {
      const profileRef = doc(db, 'editableProfiles', currentUser.uid);
      const profileDocSnapshot = await getDoc(profileRef);
      const profileDocSnapshotData = profileDocSnapshot.data();
      let uploadedPhoto;
      if (profileDocSnapshotData && profileDocSnapshotData.photoPath) {
        const storageRef = ref(getStorage(), profileDocSnapshotData.photoPath);
        uploadedPhoto = await getDownloadURL(storageRef);
      }
      dispatch(updateUserState({
        photoURL: uploadedPhoto
          || currentUser.photoURL
          || gravatar.url(currentUser.email, { s: '192', r: 'pg', d: 'retro' }, true)
          || defaultAvatarPng,
      }));
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
