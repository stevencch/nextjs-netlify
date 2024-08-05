'use client' 
import { Auth0Provider } from '@auth0/auth0-react';
import Profile from './profile'
import LoginButton from './login-button'
import LogoutButton from './logout-button'
const AuthPart = () => {
  return (
    <Auth0Provider
      domain="dev-nf0hmoutii21nyda.us.auth0.com"
      clientId="dTPdbTfgBAYjTGTxzModPlDY3tDE3o9W"
      authorizationParams={{
        //redirect_uri: window.location.origin
        redirect_uri:  process.env.NODE_ENV==='development'?'http://localhost:3000':'https://mytest0313.netlify.app'
      }}
    >
      <LoginButton />
      <br/>
      <LogoutButton />
      <Profile />
    </Auth0Provider>
  );
};


export default AuthPart;