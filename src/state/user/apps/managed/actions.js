import {
  managedAppSet,
  managedAppRemove,
} from './action-creators';

export const setManagedApp = (id, status, app) =>
  dispatch => dispatch(managedAppSet(id, status, app));

export const removeManagedApp = id =>
  dispatch => dispatch(managedAppRemove(id));
