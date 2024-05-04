import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, sendSignInLinkToEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnbRlkPkCCgwndDEnd-1moJ8Se_1D35Fw",
  authDomain: "capstoneproject451-d50f7.firebaseapp.com",
  databaseURL: "https://capstoneproject451-d50f7-default-rtdb.firebaseio.com",
  projectId: "capstoneproject451-d50f7",
  storageBucket: "capstoneproject451-d50f7.appspot.com",
  messagingSenderId: "811306304777",
  appId: "1:811306304777:web:f2a1cdc1795f0d5fc1ffd8",
  measurementId: "G-79VHWNQ2EY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {app,auth,googleProvider};