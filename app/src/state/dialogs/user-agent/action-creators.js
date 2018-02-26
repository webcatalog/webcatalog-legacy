import {
  DIALOG_USER_AGENT_CLOSE,
  DIALOG_USER_AGENT_OPEN,
  DIALOG_USER_AGENT_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogUserAgentClose = () => ({
  type: DIALOG_USER_AGENT_CLOSE,
});

export const dialogUserAgentOpen = () => ({
  type: DIALOG_USER_AGENT_OPEN,
});

export const dialogUserAgentFormUpdate = changes => ({
  type: DIALOG_USER_AGENT_FORM_UPDATE,
  changes,
});
