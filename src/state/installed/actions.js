import {
  INSTALLED_UPDATE_QUERY,
} from '../../constants/actions';

export const updateQuery = (query) => ({
  type: INSTALLED_UPDATE_QUERY,
  query,
});
