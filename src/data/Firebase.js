// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAKJJGDZZxa9N9zd69062KxIvmnxH8wvCc",
    authDomain: "unyte-62d72.firebaseapp.com",
    projectId: "unyte-62d72",
    storageBucket: "unyte-62d72.appspot.com",
    messagingSenderId: "403800269259",
    appId: "1:403800269259:web:066a6dd5634192d5ab564e",
    measurementId: "G-EZ2Z9435QX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseFirestore = getFirestore(app);