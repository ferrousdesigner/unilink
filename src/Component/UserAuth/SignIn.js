import React from 'react'
import { useState } from 'react';
import Button from '../Button/Button';
import logo from './../../images/unilink.png'
import * as firebase from "firebase";
export const SignIn = ({ onNav, onAuth, active, user }) => {
  const [busy, setBusy] = useState()
  const handleSignIn = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
      firebase
         .auth()
         .signInWithRedirect(provider)
     };
     firebase.auth().onAuthStateChanged((user) => {
       onAuth(user);
     });
     
  // console.log(">>>>User", user);
  return (
    <div className='center'>
      <section>
        <img src={logo} className='logo-pic' alt='xs'/>
        <h1 className='logo-big'>UniLink</h1>
        <h3>One link for all your accounts</h3>
        <br />
      </section>

      <br />
      <Button busy={busy} onClick={handleSignIn}>
       <span className='fab fa-google' /> {!busy ? ("Sign in with Google") : "Signing in..."}
      </Button>
    </div>
  );
};
