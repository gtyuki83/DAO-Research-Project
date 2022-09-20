// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8cb6f_FKIOTHUSXrM6-7-j28b4IkN24c",
    authDomain: "dao-research-project.firebaseapp.com",
    projectId: "dao-research-project",
    storageBucket: "dao-research-project.appspot.com",
    messagingSenderId: "360689537563",
    appId: "1:360689537563:web:8596a9b2249a533efd5ebe",
    measurementId: "G-C2JYKF7ZJ2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseFirestore = getFirestore(app);