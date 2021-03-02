/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  SET_USER_STATE,
  SET_PUBLIC_PROFILE,
  CLEAR_USER_STATE,
} from '../../constants/actions';

const savedStateJson = window.localStorage.getItem('userState');

let savedState;
if (savedStateJson) {
  try {
    savedState = JSON.parse(savedStateJson);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const initialState = {
  isSignedIn: false,
  email: '',
  displayName: '',
  photoURL: null,
  providerData: [],
  publicProfile: {
    billingPlan: 'basic',
  },
};

const user = (state = { ...initialState, ...savedState }, action) => {
  switch (action.type) {
    case SET_USER_STATE: {
      const newState = {
        ...state,
        ...action.updatedState,
      };
      window.localStorage.setItem('userState', JSON.stringify(newState));
      return newState;
    }

    case CLEAR_USER_STATE: {
      window.localStorage.removeItem('userState');
      return initialState;
    }

    case SET_PUBLIC_PROFILE: {
      const newState = {
        ...state,
        publicProfile: { ...action.publicProfile },
      };
      window.localStorage.setItem('userState', JSON.stringify(newState));
      return newState;
    }

    default:
      return state;
  }
};

export default user;
