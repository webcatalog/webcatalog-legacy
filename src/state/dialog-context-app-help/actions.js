import {
  DIALOG_CONTEXT_APP_HELP_CLOSE,
  DIALOG_CONTEXT_APP_HELP_OPEN,
} from '../../constants/actions';

export const close = () => ({
  type: DIALOG_CONTEXT_APP_HELP_CLOSE,
});

export const open = () => ({
  type: DIALOG_CONTEXT_APP_HELP_OPEN,
});
