// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBPF02xqSgUF9JG12tdse_8V_dpSRebgpM",
  authDomain: "unilink-app.firebaseapp.com",
  projectId: "unilink-app",
  storageBucket: "unilink-app.appspot.com",
  messagingSenderId: "841259281737",
  appId: "1:841259281737:web:f32180d38c07ed2319fe98",
  measurementId: "G-DSQXE3LQJV",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = {};

const db = firebaseApp.firestore();
const DB = db.collection(process.env.NODE_ENV).doc("data");
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();



export { db, auth, DB, storage, provider };
