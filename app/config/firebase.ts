// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkkCVlEuaOJPBP457-whd8kFR2kwV68Ew",
  authDomain: "learn-fb-ad80f.firebaseapp.com",
  projectId: "learn-fb-ad80f",
  storageBucket: "learn-fb-ad80f.firebasestorage.app",
  messagingSenderId: "596871599651",
  appId: "1:596871599651:web:a28db26aaf03e1f189c396",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// the gethauth help us provide the authentication service/ protect/add auth to user
export const auth = getAuth(app);

// provider is the auth type we are going to be using
export const provider = new GoogleAuthProvider();
