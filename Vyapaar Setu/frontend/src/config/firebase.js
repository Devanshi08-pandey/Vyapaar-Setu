import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoeH6fwSORKgxOH-Jc2QxfiJuJ9NyLmhY",
  authDomain: "vyapar-setu-59dda.firebaseapp.com",
  projectId: "vyapar-setu-59dda",
  storageBucket: "vyapar-setu-59dda.firebasestorage.app",
  messagingSenderId: "897319061323",
  appId: "1:897319061323:web:07cd4dd49bd09b4b76cace",
  measurementId: "G-LBBQG85HS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
