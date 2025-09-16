import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AGREEMENT_KEY = "userAgreementAccepted";
const LAST_UPDATED = "2025-09-16";

const UserAgreement: React.FC = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accepted = localStorage.getItem(AGREEMENT_KEY) === 'true';
    if (accepted) {
      // If already accepted, go to login automatically
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleAccept = () => {
    if (agreed) {
      localStorage.setItem(AGREEMENT_KEY, 'true');
      navigate('/login');
    }
  };

  const handleDecline = () => {
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Agreement</h1>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
              <strong>⚠️ CRITICAL NOTICE:</strong> This is a DEMO application only. By proceeding, you acknowledge that
              this platform has limited security and the developer is NOT responsible for any data breaches, security
              issues, or misuse.
            </div>
            <p className="text-gray-600 dark:text-gray-300">Last updated: {LAST_UPDATED}</p>
            <p className="text-gray-600 dark:text-gray-300">Please read carefully before proceeding</p>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Demo Application Agreement</h2>

            <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                What You're Agreeing To:
              </h3>
              <ul className="list-disc list-inside text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>
                  This is a <strong>demonstration application</strong> for portfolio purposes
                </li>
                <li>
                  Security measures are <strong>basic and limited</strong>
                </li>
                <li>
                  Your data may be <strong>visible to others</strong> or <strong>compromised</strong>
                </li>
                <li>
                  The developer has <strong>no liability</strong> for any issues
                </li>
                <li>
                  You will <strong>only use fake/test data</strong>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Demo Nature and Limitations</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              CodeVail is a demonstration application created to showcase technical skills. It is <strong>NOT</strong> production-ready and must <strong>NOT</strong> be used for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Actual recruitment or hiring processes</li>
              <li>Storing sensitive personal or business information</li>
              <li>Commercial or professional purposes</li>
              <li>Any mission-critical activities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Security and Data Protection Disclaimer
            </h3>
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded mb-6">
              <p className="text-red-800 dark:text-red-200 font-semibold mb-2">IMPORTANT SECURITY WARNING:</p>
              <p className="text-red-700 dark:text-red-300">
                This demo application has <strong>minimal and incomplete security measures</strong>. The developer is
                <strong> NOT RESPONSIBLE</strong> for any data breaches, unauthorized access, data loss, or security
                vulnerabilities. Use only fake or test data.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Acceptable Use</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">By using this demo, you agree to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Use only fake, test, or non-sensitive information</li>
              <li>Not attempt to exploit security vulnerabilities</li>
              <li>Not use the platform for illegal activities</li>
              <li>Understand this is for demonstration purposes only</li>
              <li>Not hold the developer liable for any issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. No Warranty or Support</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This demo is provided "as is" without any warranties. There is no guarantee of: functionality, security,
              data persistence, or support. The platform may be unavailable, modified, or discontinued at any time
              without notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Limitation of Liability</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The developer shall not be liable for any direct, indirect, incidental, special, consequential, or
              punitive damages arising from your use of this demo application, including but not limited to data
              breaches, security issues, or system failures.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Data Usage and Privacy</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Any data you enter may be stored insecurely, visible to others, or used for demonstration purposes. Do not
              enter real personal information, passwords, or confidential data. See our Privacy Policy for more details.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 mb-6">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Recommended Demo Data:</h4>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
                <li>Use fake names like "John Doe" or "Jane Smith"</li>
                <li>Use test emails like "test@example.com"</li>
                <li>Use simple passwords like "demo123"</li>
                <li>Avoid any real personal or business information</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center mb-6">
              <input
                id="agreement-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreement-checkbox" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                I understand this is a demo application with limited security, and I agree to use only fake/test data. I
                acknowledge the developer is not responsible for any data breaches or issues.
              </label>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDecline}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={!agreed}
                className={`px-6 py-2 rounded-md transition-colors ${
                  agreed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Accept and Continue
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By clicking "Accept and Continue", you acknowledge that you have read and understood this agreement and
              agree to use only test data in this demonstration application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;
