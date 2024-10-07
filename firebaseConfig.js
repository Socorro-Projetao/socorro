// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth} from 'firebase/auth'
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAg4snnkRsR_FAsfgqaHV7WuMOxXVV4qug",
  authDomain: "fir-socorro.firebaseapp.com",
  projectId: "fir-socorro",
  storageBucket: "fir-socorro.appspot.com",
  messagingSenderId: "533804727962",
  appId: "1:533804727962:web:32829859093cf5c2d4e923"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const userRef = collection(db, 'users');
export const professionalsRef = collection(db, 'professionals');
export const anunciantesRef = collection(db, 'anunciantes');
