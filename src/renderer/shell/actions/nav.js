import {
  UPDATE_TARGET_URL,
  UPDATE_IS_FAILED,
  UPDATE_IS_LOADING,
} from '../constants/actions';

export const updateTargetUrl = targetUrl => ({
  type: UPDATE_TARGET_URL,
  targetUrl,
});

export const updateIsLoading = isLoading => ({
  type: UPDATE_IS_LOADING,
  isLoading,
});

export const updateIsFailed = isFailed => ({
  type: UPDATE_IS_FAILED,
  isFailed,
});
