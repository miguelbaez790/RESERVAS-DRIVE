// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAgLky3ub0feeA1mnH-yueExhlUCLvOxs",
  authDomain: "reservas-drive-pizza.firebaseapp.com",
  databaseURL: "https://reservas-drive-pizza-default-rtdb.firebaseio.com",
  projectId: "reservas-drive-pizza",
  storageBucket: "reservas-drive-pizza.appspot.com",
  messagingSenderId: "343129946622",
  appId: "1:343129946622:web:174dd1be5bb8e5243de8af",
  measurementId: "G-EBG90VNT0Z"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
