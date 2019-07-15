import {
  DIALOG_INJECT_CSS_CLOSE,
  DIALOG_INJECT_CSS_OPEN,
  DIALOG_INJECT_CSS_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogInjectCSSClose = () => ({
  type: DIALOG_INJECT_CSS_CLOSE,
});

export const dialogInjectCSSOpen = () => ({
  type: DIALOG_INJECT_CSS_OPEN,
});

export const dialogInjectCSSFormUpdate = changes => ({
  type: DIALOG_INJECT_CSS_FORM_UPDATE,
  changes,
});
