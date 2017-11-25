import {
  TOP_CHARTS_GET_FAILED,
  TOP_CHARTS_GET_REQUEST,
  TOP_CHARTS_GET_SUCCESS,
  TOP_CHARTS_RESET,
} from '../../../constants/actions';

export const topchartsReset = () => ({
  type: TOP_CHARTS_RESET,
});

export const topChartsGetRequest = () => ({
  type: TOP_CHARTS_GET_REQUEST,
});

export const topChartsGetSuccess = res => ({
  type: TOP_CHARTS_GET_SUCCESS,
  res,
});

export const topChartsGetFailed = res => ({
  type: TOP_CHARTS_GET_FAILED,
  res,
});
