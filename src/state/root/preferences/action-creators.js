import { PREFERENCE_UPDATE } from '../../../constants/actions';

export const preferenceUpdate = (name, value) => ({
  type: PREFERENCE_UPDATE,
  name,
  value,
});
