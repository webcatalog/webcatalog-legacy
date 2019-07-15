import uuidv4 from 'uuid/v4';

import {
  addWorkspaceClose,
  addWorkspaceFormUpdate,
  addWorkspaceOpen,
} from './action-creators';

import validate from '../../../helpers/validate';
import hasErrors from '../../../helpers/has-errors';

import { requestAddWorkspace } from '../../../senders/workspaces';

import {
  STRING_NAME,
  STRING_URL,
} from '../../../constants/strings';

export const close = () =>
  dispatch => dispatch(addWorkspaceClose());

const getValidationRules = () => ({
  name: {
    fieldName: STRING_NAME,
    required: true,
  },
  url: {
    fieldName: STRING_URL,
    required: true,
    url: true,
  },
});

export const updateForm = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(addWorkspaceFormUpdate(validatedChanges));
  };

export const open = app => (dispatch) => {
  dispatch(addWorkspaceOpen());

  if (app) {
    dispatch(updateForm(app));
  }
};

export const add = () =>
  (dispatch, getState) => {
    const state = getState();

    const { form } = state.dialogs.addWorkspace;

    const validatedChanges = validate(form, getValidationRules(getState()));
    if (hasErrors(validatedChanges)) {
      dispatch(updateForm(validatedChanges));
    } else {
      const app = {
        id: uuidv4(),
        name: form.name,
        url: form.url,
        icon: form.icon,
      };
  
      requestAddWorkspace(app);
  
      dispatch(close());
    }
  };
