import {
  LOCAL_APP_SET,
  LOCAL_APP_REMOVE,
} from '../../constants/actions';

export const localAppSet = (id, status, app) => ({
  type: LOCAL_APP_SET,
  id,
  status,
  app,
});

export const localAppRemove = id => ({
  type: LOCAL_APP_REMOVE,
  id,
});
