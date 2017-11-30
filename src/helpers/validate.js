import isUrl from 'is-url';

const kits = {
  required: (val, ruleVal, fieldName) => {
    if (!val || val === '') {
      return `${fieldName} is required.`;
    }

    return null;
  },
  minLength: (val, minLength, fieldName) => {
    if (!val || val.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters.`;
    }
    return null;
  },
  maxLength: (val, maxLength, fieldName) => {
    if (!val || val.length > maxLength) {
      return `${fieldName} must have least than ${maxLength} characters.`;
    }
    return null;
  },
  url: (val, maxLength, fieldName) => {
    if (!isUrl(val)) {
      return `${fieldName} must be URL.`;
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
