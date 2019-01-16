export const getShouldUseDarkMode = (state) => {
  let shouldUseDarkMode;
  if (state.preferences.appearance === 'automatic') {
    shouldUseDarkMode = state.general.isDarkMode;
  } else {
    shouldUseDarkMode = state.preferences.appearance === 'dark';
  }
  return shouldUseDarkMode;
};
