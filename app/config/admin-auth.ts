// firebase.server.ts
// This file is for code that runs ONLY on the server (Node.js environment).
// It requires the Firebase Admin SDK.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { getFirestore } from 'firebase-admin/firestore';

// --------------------------------------------------------------------------
// !!! REPLACE THIS WITH THE ACTUAL PATH TO YOUR DOWNLOADED SERVICE ACCOUNT KEY !!!
// You can get this JSON file from your Firebase Console.
// NOTE: This file MUST be secured and not accessible from the client.
// --------------------------------------------------------------------------
import { type ServiceAccount } from 'firebase-admin';
import * as serviceAccount from "../../service-fb.json";

// Initialize the Admin SDK. 
// We use a different name ("server") to avoid conflicts with the client app.
// const adminApp = initializeApp({
//   credential: cert( serviceAccount as ServiceAccount),
// }, "server-admin");

// Auth instance for SERVER-SIDE operations (like verifyIdToken)
//export const adminAuth = getAuth(adminApp);

// Now, the adminAuth object has the verifyIdToken function!


// Firestore instance for SERVER-SIDE operations
//

//export const adminDb = getFirestore(adminApp);



// --- Updated Initialization Logic ---

const appName = "server-admin";
let adminApp;

// Check if an app with the name "server-admin" has already been initialized
if (getApps().length === 0 || getApps().find(app => app.name === appName) === undefined) {
  // If it doesn't exist, initialize the app
  adminApp = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  }, appName);
  console.log(`Firebase Admin app '${appName}' initialized.`);
} else {
  // If it already exists, retrieve the existing instance
  adminApp = getApps().find(app => app.name === appName);
  console.log(`Firebase Admin app '${appName}' retrieved.`);
}

// NOTE: The rest of the file (export const adminAuth, export const adminDb) 
// remains the same and will correctly use the 'adminApp' variable.
// Auth instance for SERVER-SIDE operations (like verifyIdToken)
export const adminAuth = getAuth(adminApp!);

// Firestore instance for SERVER-SIDE operations
export const adminDb = getFirestore(adminApp!);