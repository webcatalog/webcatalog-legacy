import {
  DIALOG_UPDATE_WEBCATALOG_FIRST_CLOSE,
  DIALOG_UPDATE_WEBCATALOG_FIRST_OPEN,
} from '../../../constants/actions';

export const dialogUpdateMainAppFirstClose = () => ({
  type: DIALOG_UPDATE_WEBCATALOG_FIRST_CLOSE,
});

export const dialogUpdateMainAppFirstOpen = () => ({
  type: DIALOG_UPDATE_WEBCATALOG_FIRST_OPEN,
});
