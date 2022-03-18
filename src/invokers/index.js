/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';

export const getRelatedPathsAsync = (appObj) => ipcRenderer.invoke('get-related-paths', appObj);
export const getMachineIdAsync = () => ipcRenderer.invoke('get-machine-id');
