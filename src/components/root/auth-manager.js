/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

import firebase, { db } from '../../firebase';

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

    const { uid } = firebase.auth().currentUser;
    const publicProfilePref = db.collection('publicProfiles').doc(uid);

    publicProfilePref.get()
      .then((doc) => {
        onSetPublicProfile(doc.data());
      })
      // eslint-disable-next-line no-console
      .catch(console.log);

    const unsubscribe = publicProfilePref
      .onSnapshot((doc) => {
        onSetPublicProfile(doc.data());
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
