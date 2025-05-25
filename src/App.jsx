import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AddItem from './Pages/AddItem';
import ListItems from './Pages/ListItems';
import AdminOrders from './Pages/AdminOrders';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import WorkerAdminPanel from './Pages/WorkerAdminPanel';
import AddCategory from './Pages/AddCategory';
import CategoryManagement from './Pages/CategoryManagement';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};


const Navigation = () => {
  const location = useLocation();
  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('isAuthenticated');
    window.location.href = '/login'; 
  };

  
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-green-600">Plant Admin Panel</h1>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Add Item
              </Link>
              <Link 
                to="/add-category" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Add-Category
              </Link>
              <Link 
                to="/show-category" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Manage-Category
              </Link>
              <Link 
                to="/list-items" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                List Items
              </Link>
              <Link 
                to="/orders" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Orders
              </Link>
              <Link 
                to="/workers" 
                className="border-transparent text-gray-600 hover:text-green-600 hover:border-green-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                workers
              </Link>
              
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 px-3 py-1 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
        
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
         
            <Route path="/" element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            } />
            <Route path="/list-items" element={
              <ProtectedRoute>
                <ListItems />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/workers" element={
              <ProtectedRoute>
                <WorkerAdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/add-category" element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            } />
            <Route path="/show-category" element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            } />
            
        
            <Route path="*" element={
              sessionStorage.getItem('isAuthenticated') === 'true' 
                ? <Navigate to="/" /> 
                : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;