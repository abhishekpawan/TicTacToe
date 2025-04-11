import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import '../../styles/App.css';

const Layout: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to allow for smooth animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`app ${isLoaded ? 'app-loaded' : ''}`}>
        <Header />
        <main className="main-container with-bottom-nav">
          <Outlet />
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Tic Tac Toe Online</p>
        </footer>
      </div>
      {/* Navigation outside main app container to avoid positioning issues */}
      <Navigation />
    </>
  );
};

export default Layout; 