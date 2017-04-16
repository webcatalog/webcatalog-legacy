import {
  UPDATE_TARGET_URL,
  UPDATE_LOADING,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

export const updateTargetUrl = targetUrl => ({
  type: UPDATE_TARGET_URL,
  targetUrl,
});

export const updateLoading = isLoading => ({
  type: UPDATE_LOADING,
  isLoading,
});

export const updateCanGoBack = canGoBack => ({
  type: UPDATE_CAN_GO_BACK,
  canGoBack,
});

export const updateCanGoForward = canGoForward => ({
  type: UPDATE_CAN_GO_FORWARD,
  canGoForward,
});
