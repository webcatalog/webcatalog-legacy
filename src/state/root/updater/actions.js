import { SET_UPDATER_STATUS } from '../../../constants/actions';

export const setUpdaterStatus = (status, data) => ({
  type: SET_UPDATER_STATUS,
  status,
  data,
});
