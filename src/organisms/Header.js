import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-800 hover:text-orange-600 transition duration-150 ease-in-out">
              Companies
            </Link>
          </li>
          {/* Add more navigation items here */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

