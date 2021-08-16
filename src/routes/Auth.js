import { authService, firebaseInstance } from 'myBase';
import React, { useState } from 'react';


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = ({ target: { name, value } }) => {
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async(e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        // log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch(error) {
      setError(error.message);
    }
  };
const toggleAccount = () => setNewAccount((prev) => !prev);
const onSocialClick = async (e) => {
  const { 
    target: { name }, 
  } = e;
  let provider;
  if (name === 'google') {
    provider = new firebaseInstance.auth.GoogleAuthProvider();
  } else if (name==="Github") {
    provider = new firebaseInstance.auth.GithubAuthProvider();
  }
  const data = await authService.signInWithPopup(provider)
};
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          name='email' 
          type='email' 
          placeholder='Email' 
          required 
          value={email}
          onChange={onChange} 
        />
        <input
          name='password' 
          type='password' 
          placeholder='Password' 
          required
          value={password}
          onChange={onChange} 
        />
        <input type='submit' value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign in." : "Create Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="Github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;