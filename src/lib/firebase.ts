import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence. This must be done after initializing Firestore,
// and it allows the app to work with a local cache while connecting.
try {
  enableIndexedDbPersistence(db);
} catch (error: any) {
  if (error.code === 'failed-precondition') {
    console.warn(
      'Firestore persistence failed. This is likely because you have multiple tabs open. Persistence will only be enabled in one tab at a time.'
    );
  } else if (error.code === 'unimplemented') {
    console.warn(
      'Firestore persistence is not supported in this browser.'
    );
  }
}

export { app, auth, db, googleProvider };
