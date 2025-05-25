import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-green-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Plant Management</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-green-700 px-3 py-2 rounded-md font-medium"
            >
              All Items
            </Link>
            <Link
              to="/list"
              className="text-white hover:bg-green-700 px-3 py-2 rounded-md font-medium"
            >
              Item List
            </Link>
            <Link
              to="/add"
              className="text-white hover:bg-green-700 px-3 py-2 rounded-md font-medium"
            >
              Add Item
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;