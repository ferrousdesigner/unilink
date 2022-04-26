// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC7D26uhTYUIO7nqA9LLg7NGbs4HXxyGho",
  authDomain: "lynkone-me.firebaseapp.com",
  projectId: "lynkone-me",
  storageBucket: "lynkone-me.appspot.com",
  messagingSenderId: "880655007489",
  appId: "1:880655007489:web:7aa56a01ccd8516dd3e500",
  measurementId: "G-GEHYCGCG44",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = {};

const db = firebaseApp.firestore();
const DB = db.collection(process.env.NODE_ENV).doc("data");
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();



export { db, auth, DB, storage, provider };
