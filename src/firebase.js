// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-next-60218.firebaseapp.com",
  projectId: "x-next-60218",
  storageBucket: "x-next-60218.appspot.com",
  messagingSenderId: "5353666532",
  appId: "1:5353666532:web:f207fdd011712d3d93b9f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);