import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">CodeVail</h3>
            <p className="text-gray-300 mb-4">
              A demonstration platform for technical interviews and coding assessments.
            </p>
            <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded text-sm">
              <strong>Demo Notice:</strong> This is a portfolio demonstration. Not for production use.
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/agreement" className="text-gray-300 hover:text-white transition-colors">
                  User Agreement
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Support (Demo Only)</span>
              </li>
              <li>
                <span className="text-gray-500">Documentation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CodeVail Demo. This is a demonstration application. Not responsible for data
            breaches or security issues.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
