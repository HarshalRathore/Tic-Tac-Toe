// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCenaO0cshkuGS2x2BnErA35W8QLag8ZKs",
  authDomain: "tic-tac-toe-44599.firebaseapp.com",
  projectId: "tic-tac-toe-44599",
  storageBucket: "tic-tac-toe-44599.appspot.com",
  messagingSenderId: "1026379283575",
  appId: "1:1026379283575:web:82f75dbd5d76b515db9a72",
  measurementId: "G-0EDP8G0H59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
// console.log(app);
console.log(firebase);
// console.log(app.database().ref("/"));

// console.log(app.storage().ref());

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     console.log(user);
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });