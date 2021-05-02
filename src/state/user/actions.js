/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import gravatar from 'gravatar';

import firebase, { db } from '../../firebase';

import defaultAvatarPng from '../../assets/default-avatar.png';

import {
  SET_USER_STATE,
  SET_PUBLIC_PROFILE,
  CLEAR_USER_STATE,
} from '../../constants/actions';

import {
  requestUpdateAuthJson,
} from '../../senders';

import {
  open as openDialogLicenseRegistration,
  updateForm as updateFormDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

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

export const setPublicProfile = (publicProfile) => (dispatch, getState) => {
  if (!publicProfile) return;

  const { currentUser } = firebase.auth();
  if (publicProfile.billingPlan) {
    window.localStorage.setItem(`billingPlan-${currentUser.uid}`, publicProfile.billingPlan);
  } else {
    window.localStorage.removeItem(`billingPlan-${currentUser.uid}`);
  }

  dispatch({
    type: SET_PUBLIC_PROFILE,
    publicProfile,
  });

  const { preferences, user } = getState();
  const billingPlan = user.publicProfile && user.publicProfile.billingPlan
    ? user.publicProfile.billingPlan : 'basic';
  const { licenseKey, registered } = preferences;
  if (billingPlan === 'basic' && registered) {
    dispatch(updateFormDialogLicenseRegistration({ licenseKey: licenseKey || '' }));
    dispatch(openDialogLicenseRegistration());
  }
};

export const updateUserAsync = () => async (dispatch, getState) => {
  const { currentUser } = firebase.auth();
  const currentUserState = getState().user;

  console.log('x', currentUser);

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
        return firebase.functions().httpsCallable('getLongtermAuthToken')()
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
      const profileRef = db.collection('editableProfiles').doc(currentUser.uid);
      const profileDocSnapshot = await profileRef.get();
      const profile = profileDocSnapshot.data();
      let uploadedPhoto;
      if (profile && profile.photoPath) {
        const storageRef = firebase.storage().ref(profile.photoPath);
        uploadedPhoto = await storageRef.getDownloadURL();
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
