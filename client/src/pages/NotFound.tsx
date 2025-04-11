import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import '../styles/App.css';

const NotFound: React.FC = () => {
  return (
    <main className="main-content">
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="not-found-link">
          <Button variant="primary">Go to Home</Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound; 