import {
  MANAGED_APP_SET,
  MANAGED_APP_REMOVE,
} from '../../../../constants/actions';

export const managedAppSet = (id, status, app) => ({
  type: MANAGED_APP_SET,
  id,
  status,
  app,
});

export const managedAppRemove = id => ({
  type: MANAGED_APP_REMOVE,
  id,
});
