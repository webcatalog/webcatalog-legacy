/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export const getCurrentPlan = (user) => {
  if (user.publicProfile && user.publicProfile.billingPlan) {
    return user.publicProfile.billingPlan;
  }
  return 'basic';
};

export const isLifetime = (user) => user.publicProfile
  && user.publicProfile.billingPlan === 'lifetime';

export const isBasic = (user) => !user.publicProfile
  || !user.publicProfile.billingPlan
  || user.publicProfile.billingPlan === 'basic';
