/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// This import loads the firebase namespace.
import firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';

// Configure Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

if (process.env.REACT_APP_USE_EMULATORS) {
  db.useEmulator('localhost', 8080);
  firebase.functions().useEmulator('localhost', 5001);
}

export default firebase;
