import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Button from '../UI/Button';
import '../../styles/Auth.css';
import { useGame } from '../../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { roomId } = useGame();
  const navigate = useNavigate();
  // Redirect to game page if in a room
  useEffect(() => {
    if (roomId) {
      void navigate('/game');
    }
  }, [roomId, navigate]);
  
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