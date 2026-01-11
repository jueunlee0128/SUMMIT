import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOHeQetUTg66CobNPjyevg20230AfGIRw",
  authDomain: "summit-ba4b8.firebaseapp.com",
  projectId: "summit-ba4b8",
  storageBucket: "summit-ba4b8.firebasestorage.app",
  messagingSenderId: "468662892074",
  appId: "1:468662892074:web:9b77161eb1bfac992a7553"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);    