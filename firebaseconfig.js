// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6VnfTtnAkih5iMLfzbuPW4y5prnHqByo",
    authDomain: "fosterpet-fcm.firebaseapp.com",
    projectId: "fosterpet-fcm",
    storageBucket: "fosterpet-fcm.appspot.com",
    messagingSenderId: "393442713469",
    appId: "1:393442713469:web:f6da0cea0b6cca9934f614",
    measurementId: "G-RKL8WLKKTM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
