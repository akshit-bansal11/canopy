import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5ObHJW2fZgjuo7j314Moe_3e9Xr4i4jE",
    authDomain: "book-it-bruh.firebaseapp.com",
    projectId: "book-it-bruh",
    storageBucket: "book-it-bruh.firebasestorage.app",
    messagingSenderId: "1094880411732",
    appId: "1:1094880411732:web:c323715e44fadd7127edc1",
    measurementId: "G-V1Z93P04WF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);