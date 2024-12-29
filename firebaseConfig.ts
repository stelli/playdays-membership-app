// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtENA0nEfbwQYIbjgrmO01QO7Bfo6g4fE",
  authDomain: "playdays-playground-member.firebaseapp.com",
  projectId: "playdays-playground-member",
  storageBucket: "playdays-playground-member.firebasestorage.app",
  messagingSenderId: "24622800763",
  appId: "1:24622800763:web:3724f9d4644953bbf9e7de",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);