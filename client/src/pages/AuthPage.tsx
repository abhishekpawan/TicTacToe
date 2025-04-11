import React from 'react';
import Auth from '../components/Auth/Auth';
import '../styles/Auth.css';

const AuthPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-title">Tic-Tac-Toe</h1>
        <p className="subtitle">Sign up or log in to play</p>
      </div>
      <Auth />
    </div>
  );
};

export default AuthPage; 