/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 const billingPlans = {
  basic: {
    name: 'WebCatalog Basic',
    apps: 10,
    workspacesPerSinglesiteApp: 2,
    workspacesPerMultisiteApp: 3,
    featureSet: 'Basic',
    support: 'Standard',
  },
  lifetime: {
    name: 'WebCatalog Lifetime',
    apps: 'Unlimited',
    workspacesPerSinglesiteApp: 'Unlimited',
    workspacesPerMultisiteApp: 'Unlimited',
    featureSet: 'Lifetime',
    support: 'Standard',
  },
  plus: {
    name: 'WebCatalog Plus',
    apps: 25,
    workspacesPerSinglesiteApp: 4,
    workspacesPerMultisiteApp: 6,
    featureSet: 'Plus',
    support: 'Standard',
  },
  pro: {
    name: 'WebCatalog Pro',
    apps: 'Unlimited',
    workspacesPerSinglesiteApp: 'Unlimited',
    workspacesPerMultisiteApp: 'Unlimited',
    featureSet: 'Pro',
    support: 'Priority',
  },
};

export default billingPlans;
