// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCDzT1zGn9qDe1juObGAQwfmZo8e8HxL8",
  authDomain: "ai-career-resume.firebaseapp.com",
  projectId: "ai-career-resume",
  storageBucket: "ai-career-resume.firebasestorage.app",
  messagingSenderId: "320770715808",
  appId: "1:320770715808:web:b61369c658cb7eded259c5",
  measurementId: "G-BHWKXLV47D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);