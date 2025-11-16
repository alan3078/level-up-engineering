import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined") {
  // Only initialize on client side
  // Check if Firebase config is provided
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (hasConfig) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      if (app) {
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
      }
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  } else {
    console.warn(
      "Firebase configuration is missing. Please set up .env.local file."
    );
  }
}

// Helper function to ensure db is initialized
export function getDb(): Firestore {
  if (!db) {
    throw new Error("Firestore not initialized");
  }
  return db;
}

export { app, db, auth, storage };
export default app;
