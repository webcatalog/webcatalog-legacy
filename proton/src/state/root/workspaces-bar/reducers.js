import { combineReducers } from 'redux';

// import {
// } from '../../../constants/actions';

const initialWorkspaces = [
  {
    workspaceId: 'c84fb90-12c4-11e1-840d-7b25c5ee775a', // uuid // https://www.npmjs.com/package/uuid
    workspaceName: 'workspace',
    workspaceAvatar: 'av.jpg',
    workspaceHomeUrl: 'gmail.com',
    workspaceDefaultApp: {},
    workspaceTabs: [{}],
  },
  {
    workspaceId: 'abcdef', // uuid // https://www.npmjs.com/package/uuid
    workspaceName: 'the-workspace',
    workspaceAvatar: 'avatar2.jpg',
    workspaceHomeUrl: 'drive.google.com',
    workspaceDefaultApp: {},
    workspaceTabs: [{}],
  },
];

const workspaces = (state = initialWorkspaces, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default combineReducers({
  workspaces,
});
