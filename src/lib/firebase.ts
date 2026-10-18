import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC75kbdEqcuOpLnhqkL7SXDiewvrNNZKdA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "orpheus-e0b16.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "orpheus-e0b16",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "orpheus-e0b16.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "401660194934",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:401660194934:web:903cbd84f4c972e91d6f57",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ZZQY34MT3W"
};

// Initialize Firebase only if there are no apps initialized yet and config is present
let app: any;
if (!getApps().length && firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
} else if (getApps().length) {
  app = getApp();
}

const auth = app ? getAuth(app) : null as any;
const db = app ? getFirestore(app) : null as any;

let analytics: any = null;
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in this environment
  });
}

export { app, auth, db, analytics };
