import {
  ACTIVATED_CHANGE,
  BROWSER_INSTALLLED_CHANGE,
} from '../../../constants/actions';

export const browserInstalledChange = browserInstalled => ({
  type: BROWSER_INSTALLLED_CHANGE,
  browserInstalled,
});

export const activatedChange = activated => ({
  type: ACTIVATED_CHANGE,
  activated,
});
