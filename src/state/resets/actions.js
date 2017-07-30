import { resetAppDetails as resetAppDetailsActionType } from './action-creators';

export const resetAppDetails = () =>
  dispatch => dispatch(resetAppDetailsActionType());
