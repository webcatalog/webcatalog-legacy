import {
  DIALOG_ACCOUNT_CLOSE,
  DIALOG_ACCOUNT_OPEN,
  DIALOG_ACCOUNT_SECTION_CHANGE,
} from '../../../../constants/actions';

export const dialogAccountClose = () => ({
  type: DIALOG_ACCOUNT_CLOSE,
});

export const dialogAccountOpen = () => ({
  type: DIALOG_ACCOUNT_OPEN,
});

export const dialogAccountSectionChange = section => ({
  type: DIALOG_ACCOUNT_SECTION_CHANGE,
  section,
});
