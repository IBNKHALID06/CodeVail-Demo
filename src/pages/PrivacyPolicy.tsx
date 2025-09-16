import React from "react";

const LAST_UPDATED = "2025-09-16";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
              <strong>⚠️ DEMO APPLICATION NOTICE:</strong> This is a demonstration application with limited security. Do
              not enter real personal information. The developer is not responsible for data breaches.
            </div>
            <p className="text-gray-600 dark:text-gray-300">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This demo application may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Email addresses, usernames, and basic profile data
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with the demo platform
              </li>
              <li>
                <strong>Technical Data:</strong> IP addresses, browser information, device data
              </li>
              <li>
                <strong>Content:</strong> Code submissions, test responses, and uploaded files
              </li>
              <li>
                <strong>Communication:</strong> Messages sent through the platform
              </li>
            </ul>

            <div className="bg-orange-50 dark:bg-orange-900 border-l-4 border-orange-400 p-4 mb-6">
              <p className="text-orange-800 dark:text-orange-200">
                <strong>WARNING:</strong> This demo has limited / incomplete security. Do not enter real or regulated personal data (PII, PHI, financial, credentials). Use only anonymous test data.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Information collected in this demo is used to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Demonstrate platform functionality</li>
              <li>Provide basic user authentication</li>
              <li>Enable core features like test creation and video calls</li>
              <li>Improve the demo experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Security Limitations</h2>
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded mb-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                IMPORTANT SECURITY DISCLAIMER
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-2">
                This demo application has <strong>LIMITED SECURITY MEASURES</strong>. The developer is
                <strong> NOT RESPONSIBLE</strong> for:
              </p>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                <li>Data breaches or unauthorized access</li>
                <li>Loss or theft of user information</li>
                <li>Security vulnerabilities</li>
                <li>Misuse of data by third parties</li>
                <li>Any damages resulting from data exposure</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">As a demo application, data may be:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>Visible to other demo users</li>
              <li>Stored in unsecured databases</li>
              <li>Accessible to anyone with system access</li>
              <li>Not encrypted or properly protected</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Demo data may be retained temporarily, indefinitely, or deleted without notice. There is no data retention policy or guarantee of persistence.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This demo may use cookies and similar technologies for basic functionality. These may not be properly
              secured and could be accessible to unauthorized parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This demo may integrate with third-party services that have their own privacy policies. The developer is
              not responsible for the privacy practices of these services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This demo is not intended for children under 13. If you are under 13, please do not use this application
              or provide any personal information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Your Rights and Choices</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              As a demo user, you have limited rights regarding your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>You can stop using the demo at any time</li>
              <li>You can request data deletion (no guarantee it will be honored)</li>
              <li>You can contact the developer with concerns</li>
              <li>You should not expect formal data protection rights</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This privacy policy may be updated at any time without notice. Continued use of the demo constitutes
              acceptance of any changes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              For questions, contact the developer through the original distribution channel. This demo provides no formal data subject rights workflow.
            </p>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                <strong>FINAL REMINDER:</strong> This is a demonstration application with minimal security. Use fake
                data only. The developer assumes no responsibility for data breaches or privacy violations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
