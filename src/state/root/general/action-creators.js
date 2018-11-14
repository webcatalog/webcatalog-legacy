import {
  BROWSER_INSTALLLED_CHANGE,
} from '../../../constants/actions';

export const browserInstalledChange = browserInstalled => ({
  type: BROWSER_INSTALLLED_CHANGE,
  browserInstalled,
});