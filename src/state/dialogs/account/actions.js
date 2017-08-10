import {
  dialogAccountClose,
  dialogAccountOpen,
  dialogAccountSectionChange,
} from './action-creators';

import { formUpdate as profileFormUpdate } from './profile/actions';

const initializeProfileForm = () =>
  (dispatch, getState) => {
    const {
      displayName,
      email,
    } = getState().user.apiData;

    const initializeData = {
      displayName,
      email,
    };

    dispatch(profileFormUpdate(initializeData));
  };

export const close = () =>
  dispatch => dispatch(dialogAccountClose());

export const open = () =>
  (dispatch) => {
    dispatch(initializeProfileForm());
    dispatch(dialogAccountOpen());
  };

export const sectionChange = section =>
  dispatch => dispatch(dialogAccountSectionChange(section));
