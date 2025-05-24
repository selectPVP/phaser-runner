// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your config from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3qCqNbDCUtyUjzUv8BpbAU8lmNWWLmw",
  authDomain: "leaderboard-95bb9.firebaseapp.com",
  projectId: "leaderboard-95bb9",
  storageBucket: "leaderboard-95bb9.appspot.com",
  messagingSenderId: "817274740285",
  appId: "1:817274740285:web:3bdd30aa19393f638a9454"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);
