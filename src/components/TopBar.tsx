import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

const navLinks: { label: string; to: string; public?: boolean }[] = [
  { label: 'Home', to: '/login', public: true },
  { label: 'Terms', to: '/terms', public: true },
  { label: 'Privacy', to: '/privacy', public: true },
];

const AGREEMENT_KEY = 'userAgreementAccepted';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const agreementAccepted = typeof window !== 'undefined' && localStorage.getItem(AGREEMENT_KEY) === 'true';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${location.pathname === l.to ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {l.label}
              </Link>
            ))}
            {agreementAccepted && user && (
              <Link
                to="/dashboard"
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${location.pathname.startsWith('/dashboard') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'light' ? (
              <span className="text-xs font-semibold">🌙</span>
            ) : (
              <span className="text-xs font-semibold">☀️</span>
            )}
          </button>
          {user ? (
            <span className="hidden sm:inline text-xs text-gray-600 dark:text-gray-400">{user.email}</span>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-blue-600/60 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
