import {
  appBarChangeTab,
} from './action-creators';

export const changeTab = tab =>
  dispatch => dispatch(appBarChangeTab(tab));
