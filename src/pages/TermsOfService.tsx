import React from "react";

const LAST_UPDATED = "2025-09-16";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
              <strong>⚠️ DEMO APPLICATION NOTICE:</strong> This is a demonstration application only. The developer is not
              responsible for any data breaches, security issues, or misuse of this platform.
            </div>
            <p className="text-gray-600 dark:text-gray-300">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              By accessing and using CodeVail ("the Service"), you accept and agree to be bound by the terms and
              provision of this agreement. This is a <strong>demonstration application</strong> created for portfolio
              and educational purposes only.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Demo Application Disclaimer
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>IMPORTANT:</strong> This application is provided "as is" exclusively for non-commercial demonstration and portfolio review. No warranties of any kind (express or implied) are provided including but not limited to merchantability, fitness for a particular purpose, security, availability, or accuracy. Users assume all risks.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Use License</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Permission is granted to temporarily use CodeVail for demonstration and evaluation purposes only. This
              license shall automatically terminate if you violate any of these restrictions.
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Do not use for actual recruitment or hiring decisions</li>
              <li>Do not input sensitive or confidential information</li>
              <li>Do not attempt to exploit security vulnerabilities</li>
              <li>Do not use for commercial purposes</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Data and Security Limitations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              As a demo application, CodeVail has limited security measures and SHOULD NOT be used to process, transmit, or store real personal, confidential, proprietary, regulated, or production data. The developer is
              <strong> NOT RESPONSIBLE</strong> for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Data breaches or unauthorized access to user information</li>
              <li>Loss of data or content uploaded to the platform</li>
              <li>Security vulnerabilities or system compromises</li>
              <li>Misuse of the platform by other users</li>
              <li>Any damages resulting from use of this demo</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. User Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Users are responsible for:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Using the platform responsibly and ethically</li>
              <li>Not sharing sensitive personal or business information</li>
              <li>Understanding this is a demo with limited functionality</li>
              <li>Reporting any issues or concerns to the developer</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              In no event shall the developer be liable for any damages (including, without limitation, damages for loss
              of data or profit, or due to business interruption) arising out of the use or inability to use this demo
              application, even if the developer has been notified orally or in writing of the possibility of such
              damage.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Modifications</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The developer may revise these terms of service at any time without notice. By using this demo
              application, you are agreeing to be bound by the then current version of these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              For questions about these Terms of Service or the demo application, contact the developer via the channel where you obtained this demo (responses not guaranteed).
            </p>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                This is a demonstration application. Use at your own risk. The developer assumes no liability for any
                issues arising from use of this platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
