// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCla9PtY88S7dc_ZsQpFAiiuI0uSwumqIQ",
	authDomain: "house-market-app-fdf27.firebaseapp.com",
	projectId: "house-market-app-fdf27",
	storageBucket: "house-market-app-fdf27.appspot.com",
	messagingSenderId: "828191817819",
	appId: "1:828191817819:web:d7333f9c7ebe7ad4757f7e",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const db = getFirestore();

/*

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

*/
