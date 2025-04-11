import React from 'react';
import Welcome from '../components/Welcome/Welcome';
import '../styles/WelcomePage.css';

const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-page">
      <Welcome />
    </div>
  );
};

export default WelcomePage; 