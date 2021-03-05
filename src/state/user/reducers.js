/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  SET_USER_STATE,
  SET_PUBLIC_PROFILE,
  CLEAR_USER_STATE,
} from '../../constants/actions';

const initialState = {
  isSignedIn: false,
  email: '',
  displayName: '',
  photoURL: null,
  providerData: [],
  authToken: null,
  publicProfile: {
    billingPlan: 'basic',
  },
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_STATE: {
      return {
        ...state,
        ...action.updatedState,
      };
    }

    case CLEAR_USER_STATE: {
      return initialState;
    }

    case SET_PUBLIC_PROFILE: {
      return {
        ...state,
        publicProfile: { ...action.publicProfile },
      };
    }

    default:
      return state;
  }
};

export default user;
