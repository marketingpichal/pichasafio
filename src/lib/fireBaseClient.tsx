// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuvxWzJTl0ADggI9WpNbBmhoi_1bOo7hM",
  authDomain: "pichasafioimagen.firebaseapp.com",
  projectId: "pichasafioimagen",
  storageBucket: "pichasafioimagen.appspot.com", // ojo que aquí es appspot.com, no .app
  messagingSenderId: "456235212423",
  appId: "1:456235212423:web:d0ec68ce8e67a399bce222",
  measurementId: "G-B0VFMBCNWM"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
