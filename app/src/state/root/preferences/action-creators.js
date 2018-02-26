import { PREFERENCES_SET } from '../../../constants/actions';

export const preferencesSet = (name, value) => ({
  type: PREFERENCES_SET,
  name,
  value,
});
