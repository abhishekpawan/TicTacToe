import Auth from '../components/Auth/Auth';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <Link to="/" className="back-button">
        &larr; Back to Game
      </Link>
      <h1>Tic-Tac-Toe</h1>
      <p className="subtitle">Sign up or log in to play</p>
      <Auth />
    </div>
  );
};

export default AuthPage; 