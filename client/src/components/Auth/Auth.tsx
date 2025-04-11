import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import '../../styles/Auth.css';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={`toggle-button ${showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-button ${!showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(false)}
        >
          Sign Up
        </button>
      </div>
      {showLogin ? <LoginForm /> : <SignupForm />}
    </div>
  );
};

export default Auth; 