// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAtNAyKvS8bYAx1tXDCsm5Tis6dvb85FF8",
  authDomain: "primafacie-app.firebaseapp.com",
  projectId: "primafacie-app",
  storageBucket: "primafacie-app.appspot.com",
  messagingSenderId: "844779233805",
  appId: "1:844779233805:web:af955b5c1c93d910b56b44",
  measurementId: "G-PSZRCF6TPB",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = {};

const db = firebaseApp.firestore();
const DB = db.collection(process.env.NODE_ENV).doc("data");
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();



export { db, auth, DB, storage, provider };
