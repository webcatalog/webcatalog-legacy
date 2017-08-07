import {
  LOCAL_SET_APP,
  LOCAL_REMOVE_APP,
} from '../../constants/actions';

export const localAppSet = (id, status, app) => ({
  type: LOCAL_SET_APP,
  id,
  status,
  app,
});

export const localAppRemove = id => ({
  type: LOCAL_REMOVE_APP,
  id,
});
