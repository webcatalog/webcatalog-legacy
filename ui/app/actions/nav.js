import {
  UPDATE_LOADING,
} from '../constants/actions';

export const updateLoading = isLoading => ({
  type: UPDATE_LOADING,
  isLoading,
});
