import {
  DIALOG_INJECT_JS_CLOSE,
  DIALOG_INJECT_JS_OPEN,
  DIALOG_INJECT_JS_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogInjectJSClose = () => ({
  type: DIALOG_INJECT_JS_CLOSE,
});

export const dialogInjectJSOpen = () => ({
  type: DIALOG_INJECT_JS_OPEN,
});

export const dialogInjectJSFormUpdate = changes => ({
  type: DIALOG_INJECT_JS_FORM_UPDATE,
  changes,
});
