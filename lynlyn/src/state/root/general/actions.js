import {
  activatedChange,
  activePageChange,
} from './action-creators';

export const updateActivated = activated =>
  (dispatch) => {
    dispatch(activatedChange(activated));
  };

export const updateActivePage = (activePage, workspaceId) =>
  (dispatch) => {
    dispatch(activePageChange(activePage, workspaceId));
  };
