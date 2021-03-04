import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyA8uWRIIS33KCSL5Ays6hkY69oOZE8X9Zo",
  authDomain: "react-typescript-chat-ap-d6740.firebaseapp.com",
  projectId: "react-typescript-chat-ap-d6740",
  storageBucket: "react-typescript-chat-ap-d6740.appspot.com",
  messagingSenderId: "759481714764",
  appId: "1:759481714764:web:7dafa2323bcb1bffd58ce9",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, firebase, storage, app };
