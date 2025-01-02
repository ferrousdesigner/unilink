import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import logo from "./../../images/unilink.png";
import firebase from "firebase/app";
import "firebase/auth";

export const SignIn = ({ onNav, onAuth, active, user, onBusy }) => {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((users) => {
      if (users) {
        onAuth(user);
        onNav("dashboard");
        console.log(`Signed in with`, users);
      } else {
        onAuth(null);
        onNav("home");
        console.log("Signed out");
      }
    });

    return () => unsubscribe();
  }, [onAuth, onNav]);

  const handleSignIn = async () => {
    setBusy(true);
    onBusy(true);

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log(
        "User signed in with Google: ",
        firebase.auth().currentUser.uid,
        firebase.auth().currentUser.displayName
      );
    } catch (error) {
      console.error("Sign-In Error:", error);
    } finally {
      setBusy(false);
      onBusy(false);
      console.log(
        "User signed in: ",
        firebase.auth().currentUser.uid,
        firebase.auth().currentUser.displayName
      );
    }
  };

  if (!active) return null;

  return (
    <div className="center">
      <section>
        <img
          src={logo}
          className={busy ? "logo-pic slow-spin" : "logo-pic"}
          alt="Google Sign-In"
        />
        <h1 className="logo-big">LynkOne</h1>
        <h3>One link for all your accounts</h3>
        <br />
      </section>
      <br />
      <Button busy={busy} onClick={handleSignIn}>
        <span className="fab fa-google" />
        {!busy ? "Sign in with Google" : "Signing in..."}
      </Button>
    </div>
  );
};
