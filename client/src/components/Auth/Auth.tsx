import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Button from '../UI/Button';
import '../../styles/Auth.css';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <Button
          variant="text"
          className={`toggle-button ${showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
        <Button
          variant="text"
          className={`toggle-button ${!showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(false)}
        >
          Sign Up
        </Button>
      </div>
      {showLogin ? <LoginForm /> : <SignupForm />}
    </div>
  );
};

export default Auth; 