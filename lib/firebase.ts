// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA5ULRkc1BzPgRw8bsICf07gIYEwqHON_A",
  authDomain: "softronix-8c336.firebaseapp.com",
  projectId: "softronix-8c336",
  storageBucket: "softronix-8c336.firebasestorage.app",
  messagingSenderId: "980786931813",
  appId: "1:980786931813:web:a04f3e2bf5d16a90ddbe8c",
  measurementId: "G-E1KW8HQZGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics and get a reference to the service (only in browser)
export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const analyticsIsSupported = await isSupported();
    if (analyticsIsSupported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;