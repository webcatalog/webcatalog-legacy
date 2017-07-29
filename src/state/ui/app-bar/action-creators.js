import {
  APP_BAR_CHANGE_TAB,
} from '../../../constants/actions';

export const appBarChangeTab = tab => ({
  type: APP_BAR_CHANGE_TAB,
  tab,
});
