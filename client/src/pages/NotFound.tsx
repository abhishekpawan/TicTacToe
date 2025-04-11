import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const NotFound: React.FC = () => {
  return (
    <main className="main-content">
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn">Go to Home</Link>
      </div>
    </main>
  );
};

export default NotFound; 