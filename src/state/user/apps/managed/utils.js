export const isUninstalling = (state, id) => {
  const managedApp = state.user.apps.managed[id];
  if (managedApp && managedApp.status === 'UNINSTALLING') {
    console.log('true', id);
    return true;
  }
  return false;
};
