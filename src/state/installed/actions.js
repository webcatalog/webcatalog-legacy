import {
  INSTALLED_UPDATE_QUERY,
  INSTALLED_SELECT_APP_IDS,
  INSTALLED_DESELECT_APP_IDS,
  INSTALLED_DESELECT_ALL,
} from '../../constants/actions';

export const updateQuery = (query) => ({
  type: INSTALLED_UPDATE_QUERY,
  query,
});

export const selectAppIds = (ids) => ({
  type: INSTALLED_SELECT_APP_IDS,
  ids,
});

export const deselectAppIds = (ids) => ({
  type: INSTALLED_DESELECT_APP_IDS,
  ids,
});

export const deselectAll = () => ({
  type: INSTALLED_DESELECT_ALL,
});
