import {
  ACTIVATED_CHANGE,
  ACTIVE_PAGE_CHANGE,
} from '../../../constants/actions';

export const activatedChange = activated => ({
  type: ACTIVATED_CHANGE,
  activated,
});

export const activePageChange = (activePage, workspaceId) => ({
  type: ACTIVE_PAGE_CHANGE,
  activePage,
  workspaceId,
});
