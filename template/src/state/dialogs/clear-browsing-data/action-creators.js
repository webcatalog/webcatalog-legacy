import {
  DIALOG_CLEAR_BROWSING_DATA_CLOSE,
  DIALOG_CLEAR_BROWSING_DATA_OPEN,
} from '../../../constants/actions';

export const dialogClearBrowsingDataClose = () => ({
  type: DIALOG_CLEAR_BROWSING_DATA_CLOSE,
});

export const dialogClearBrowsingDataOpen = () => ({
  type: DIALOG_CLEAR_BROWSING_DATA_OPEN,
});
