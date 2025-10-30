// firebase.server.ts
// This file is for code that runs ONLY on the server (Node.js environment).
// It requires the Firebase Admin SDK.

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// --------------------------------------------------------------------------
// !!! REPLACE THIS WITH THE ACTUAL PATH TO YOUR DOWNLOADED SERVICE ACCOUNT KEY !!!
// You can get this JSON file from your Firebase Console.
// NOTE: This file MUST be secured and not accessible from the client.
// --------------------------------------------------------------------------
import { type ServiceAccount } from 'firebase-admin';
import * as serviceAccount from "../../service-fb.json";

// Initialize the Admin SDK. 
// We use a different name ("server") to avoid conflicts with the client app.
const adminApp = initializeApp({
  credential: cert( serviceAccount as ServiceAccount),
}, "server-admin");

// Auth instance for SERVER-SIDE operations (like verifyIdToken)
export const adminAuth = getAuth(adminApp);

// Now, the adminAuth object has the verifyIdToken function!