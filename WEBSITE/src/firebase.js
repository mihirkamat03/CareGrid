import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjMqJNOTQDt5GYdxVCMIAP5xquDFLvHGg",
  authDomain: "caregrid-eb0a0.firebaseapp.com",
  databaseURL: "https://caregrid-eb0a0-default-rtdb.firebaseio.com",
  projectId: "caregrid-eb0a0",
  storageBucket: "caregrid-eb0a0.firebasestorage.app",
  messagingSenderId: "307776348499",
  appId: "1:307776348499:web:4d82f1e22486f463c0c1a6",
  measurementId: "G-ZTVP7TKLQR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
