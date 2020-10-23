import {
  DIALOG_REFERRAL_CLOSE,
  DIALOG_REFERRAL_OPEN,
} from '../../constants/actions';

export const close = () => ({
  type: DIALOG_REFERRAL_CLOSE,
});

export const open = () => ({
  type: DIALOG_REFERRAL_OPEN,
});
