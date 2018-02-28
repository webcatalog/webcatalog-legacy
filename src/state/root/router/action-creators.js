import {
  ROUTE_CHANGE,
  CHROME_INSTALLLED_CHANGE,
} from '../../../constants/actions';

export const routeChange = (route, previousRoute) => ({
  type: ROUTE_CHANGE,
  route,
  previousRoute,
});

export const chromeInstalledChange = chromeInstalled => ({
  type: CHROME_INSTALLLED_CHANGE,
  chromeInstalled,
});
