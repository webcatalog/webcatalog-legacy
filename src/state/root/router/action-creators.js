import {
  ROUTE_CHANGE,
  BROWSER_INSTALLLED_CHANGE,
} from '../../../constants/actions';

export const routeChange = (route, previousRoute) => ({
  type: ROUTE_CHANGE,
  route,
  previousRoute,
});

export const browserInstalledChange = browserInstalled => ({
  type: BROWSER_INSTALLLED_CHANGE,
  browserInstalled,
});
