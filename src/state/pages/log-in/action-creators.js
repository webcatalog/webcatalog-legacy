import {
  LOG_IN_FORM_UPDATE,
} from '../../../constants/actions';

export const logInFormUpdate = changes => ({
  type: LOG_IN_FORM_UPDATE,
  changes,
});
