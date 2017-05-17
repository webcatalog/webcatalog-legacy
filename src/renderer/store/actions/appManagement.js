import { SET_MANAGED_APP, REMOVE_MANAGED_APP } from '../constants/actions';

export const setManagedApp = (id, status, app) => ({
  type: SET_MANAGED_APP, id, status, app,
});

export const removeManagedApp = id => ({
  type: REMOVE_MANAGED_APP, id,
});
