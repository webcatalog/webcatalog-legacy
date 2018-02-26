import {
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
  UPDATE_IS_FAILED,
  UPDATE_IS_LOADING,
  UPDATE_TARGET_URL,
} from '../../../constants/actions';

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

export const updateCanGoBack = canGoBack => ({
  type: UPDATE_CAN_GO_BACK,
  canGoBack,
});

export const updateCanGoForward = canGoForward => ({
  type: UPDATE_CAN_GO_FORWARD,
  canGoForward,
});
