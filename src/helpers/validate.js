import isUrl from 'is-url';

import {
  STRING_IS_REQUIRED,
  STRING_IS_URL,
} from '../constants/strings';

const kits = {
  required: (val, ruleVal, fieldName) => {
    if (!val || val === '') {
      return STRING_IS_REQUIRED.replace('{fieldName}', fieldName);
    }

    return null;
  },
  url: (val, maxLength, fieldName) => {
    if (!isUrl(val)) {
      return STRING_IS_URL.replace('{fieldName}', fieldName);
    }
    return null;
  },
};

const validate = (changes, rules) => {
  const newChanges = { ...changes };

  Object.keys(changes).forEach((key) => {
    let err = null;

    const val = newChanges[key];

    if (rules[key]) {
      const { fieldName } = rules[key];

      Object.keys(rules[key]).find((ruleName) => {
        if (ruleName === 'fieldName') return false;

        const ruleVal = rules[key][ruleName];

        err = kits[ruleName](val, ruleVal, fieldName);

        return err !== null;
      });
    }

    newChanges[`${key}Error`] = err;
  });

  return newChanges;
};

export default validate;
