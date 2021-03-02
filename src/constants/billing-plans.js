/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const billingPlans = {
  basic: {
    name: 'WebCatalog Basic',
    apps: 15,
    workspacesPerApp: 2,
    features: 'Basic',
    support: 'Standard',
  },
  lifetime: {
    name: 'WebCatalog Lifetime',
    apps: 'Unlimited',
    workspacesPerApp: 'Unlimited',
    features: 'Plus',
    support: 'Standard',
  },
  plus: {
    name: 'WebCatalog Plus',
    apps: 50,
    workspacesPerApp: 2,
    features: 'Plus',
    support: 'Standard',
  },
  pro: {
    name: 'WebCatalog Pro',
    apps: 'Unlimited',
    workspacesPerApp: 'Unlimited',
    features: 'Pro',
    support: 'Priority',
  },
};

export default billingPlans;
