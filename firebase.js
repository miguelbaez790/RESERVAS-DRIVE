// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWfZj1D74LuyoqM0QpHadX4qjEuxlxn_I",
  authDomain: "drive-pizza-b1ff2.firebaseapp.com",
  databaseURL: "https://drive-pizza-b1ff2-default-rtdb.firebaseio.com",
  projectId: "drive-pizza-b1ff2",
  storageBucket: "drive-pizza-b1ff2.firebasestorage.app",
  messagingSenderId: "607565607786",
  appId: "1:607565607786:web:e4e0ec082c6163d34aab13",
  measurementId: "G-GRPK9N1M2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);