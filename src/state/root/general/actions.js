import { activatedChange } from './action-creators';

export const updateActivated = activated =>
  (dispatch) => {
    dispatch(activatedChange(activated));
  };
