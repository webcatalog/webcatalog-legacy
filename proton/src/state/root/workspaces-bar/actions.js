import {
  workspacesBarSetActive,
} from './action-creators';

export const setActive = workspace =>
  (dispatch) => {
    // console.log('workspace:', workspace);
    dispatch(workspacesBarSetActive(workspace));
  };
