// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5GftiUqX8S1nzl_FaoI9Mzec904_nFPU",
  authDomain: "self-study-app-db1bf.firebaseapp.com",
  projectId: "self-study-app-db1bf",
  storageBucket: "self-study-app-db1bf.appspot.com",
  messagingSenderId: "379034237102",
  appId: "1:379034237102:web:f9962ffca1cb366a52953f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);