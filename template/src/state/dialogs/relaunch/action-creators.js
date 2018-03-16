import {
  DIALOG_RELAUNCH_CLOSE,
  DIALOG_RELAUNCH_OPEN,
} from '../../../constants/actions';

export const dialogRelaunchClose = () => ({
  type: DIALOG_RELAUNCH_CLOSE,
});

export const dialogRelaunchOpen = () => ({
  type: DIALOG_RELAUNCH_OPEN,
});
