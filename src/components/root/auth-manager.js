/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuth } from '@firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import connectComponent from '../../helpers/connect-component';

import { db } from '../../firebase';

import { setPublicProfile, updateUserAsync } from '../../state/user/actions';

const AuthManager = ({
  isSignedIn,
  onSetPublicProfile,
  onUpdateUserAsync,
}) => {
  useEffect(() => {
    if (!isSignedIn) {
      return () => {};
    }

    const { uid } = getAuth().currentUser;
    const publicProfileRef = doc(db, 'publicProfiles', uid);

    getDoc(publicProfileRef)
      .then((_doc) => {
        onSetPublicProfile(_doc.data());
      })
      // eslint-disable-next-line no-console
      .catch(console.log);

    const unsubscribe = onSnapshot(publicProfileRef, (_doc) => {
      setPublicProfile(_doc.data());
    });

    return () => {
      unsubscribe();
    };
  }, [isSignedIn, onSetPublicProfile]);

  useEffect(() => {
    if (isSignedIn) {
      onUpdateUserAsync();
    }
  }, [isSignedIn, onUpdateUserAsync]);

  return null;
};

AuthManager.defaultProps = {
  isSignedIn: false,
};

AuthManager.propTypes = {
  isSignedIn: PropTypes.bool,
  onSetPublicProfile: PropTypes.func.isRequired,
  onUpdateUserAsync: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isSignedIn: state.user.isSignedIn,
});

const actionCreators = {
  setPublicProfile,
  updateUserAsync,
};

export default connectComponent(
  AuthManager,
  mapStateToProps,
  actionCreators,
);
