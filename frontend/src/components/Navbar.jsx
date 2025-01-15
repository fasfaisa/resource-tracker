import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'border-white text-white' : 'border-transparent text-gray-300 hover:text-white';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/70 shadow-lg z-10 hover:bg-black/90 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Resource Tracker
            </Link>
          </div>
          <div className="flex items-center space-x-8">
          <Link
              to="/"
              className={`${isActive('/')} border-b-2 transition-colors duration-200 px-1 py-2`}
            >
              Home
            </Link>
            <Link
              to="/resource"
              className={`${isActive('/resource')} border-b-2 transition-colors duration-200 px-1 py-2`}
            >
              Resources
            </Link>
            <Link
              to="/allocate"
              className={`${isActive('/allocate')} border-b-2 transition-colors duration-200 px-1 py-2`}
            >
              Allocate
            </Link>
            <Link
              to="/utilization"
              className={`${isActive('/utilization')} border-b-2 transition-colors duration-200 px-1 py-2`}
            >
              Utilization
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
