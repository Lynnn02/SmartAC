// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOf9JEl5Xebo2q3llSr-J3k09p4oyiABk",
  authDomain: "smartac-28a3c.firebaseapp.com",
  projectId: "smartac-28a3c",
  storageBucket: "smartac-28a3c.firebasestorage.app",
  messagingSenderId: "603927886224",
  appId: "1:603927886224:web:5c42531393a4bf56ee5b15",
  measurementId: "G-0523PF43VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
