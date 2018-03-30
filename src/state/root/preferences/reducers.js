import { PREFERENCE_UPDATE } from '../../../constants/actions';

export const defaultState = {
  browser: window.platform === 'win32' ? 'google-chrome' : null,
};

const getInitialValue = (name) => {
  /* global localStorage */
  const localValue = localStorage.getItem(`preference-${name}`);
  if (localValue == null) {
    return defaultState[name];
  }

  return JSON.parse(localValue);
};

const initialState = {};
Object.keys(defaultState).forEach((key) => {
  initialState[key] = getInitialValue(key);
});

const preferences = (state = initialState, action) => {
  switch (action.type) {
    case PREFERENCE_UPDATE: {
      const { name, value } = action;
      const newState = {};

      newState[name] = action.value;

      localStorage.setItem(`preference-${name}`, JSON.stringify(value));

      return Object.assign({}, state, newState);
    }
    default:
      return state;
  }
};

export default preferences;
