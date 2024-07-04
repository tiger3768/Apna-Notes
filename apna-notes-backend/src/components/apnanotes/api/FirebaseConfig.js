import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBi5Z_SjcuZ5TkA-KjyJPclG0ZIWIDhg6s",
  authDomain: "apna-notes-b56a7.firebaseapp.com",
  projectId: "apna-notes-b56a7",
  storageBucket: "apna-notes-b56a7.appspot.com",
  messagingSenderId: "840873920215",
  appId: "1:840873920215:web:17bd72aaa52439aee19292",
  measurementId: "G-2JRDVPLNC2"
};

const app = initializeApp(firebaseConfig);
export const fileDB = getStorage(app);