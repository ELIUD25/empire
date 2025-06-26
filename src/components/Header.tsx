import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Crown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Crown className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            <span className="text-xl font-bold text-white">Empire Mine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              to="/betting"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Betting
            </Link>
            <Link
              to="/trading"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Trading
            </Link>
            {user?.isActivated && (
              <>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  to="/casino"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Casino
                </Link>
                <Link
                  to="/ads"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ads
                </Link>
                <Link
                  to="/microtasks"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tasks
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5 text-white" />
                  <span className="text-white">{user.name}</span>
                  <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded text-xs">
                    <DollarSign className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">{user.balance}</span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-xl">
                    <div className="p-4 border-b border-gray-700">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-red-400 hover:bg-gray-800 rounded transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link
                to="/betting"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Betting
              </Link>
              <Link
                to="/trading"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Trading
              </Link>
              {user?.isActivated && (
                <>
                  <Link
                    to="/blog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/casino"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Casino
                  </Link>
                  <Link
                    to="/ads"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Ads
                  </Link>
                  <Link
                    to="/microtasks"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Tasks
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
