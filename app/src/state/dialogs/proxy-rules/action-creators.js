import {
  DIALOG_PROXY_RULES_CLOSE,
  DIALOG_PROXY_RULES_OPEN,
  DIALOG_PROXY_RULES_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogProxyRulesClose = () => ({
  type: DIALOG_PROXY_RULES_CLOSE,
});

export const dialogProxyRulesOpen = () => ({
  type: DIALOG_PROXY_RULES_OPEN,
});

export const dialogProxyRulesFormUpdate = changes => ({
  type: DIALOG_PROXY_RULES_FORM_UPDATE,
  changes,
});
