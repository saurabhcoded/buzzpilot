import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="privacy-policy-container container p-4">
            <h1 className='font-bold text-2xl'>Privacy Policy</h1>
            <p><strong>Effective Date</strong>: 5 March 2025</p>

            <h2>1. Information We Collect</h2>
            <p>
                <strong>Personal Information</strong>: When you create an account, we collect personal information such as your name, email address, and any other information you provide.
            </p>
            <p>
                <strong>Usage Data</strong>: We collect information about how you access and use the Service, including IP addresses, browser types, and operating system details.
            </p>
            <p>
                <strong>Cookies</strong>: We use cookies to enhance your experience, track usage patterns, and improve the Service. You can control cookie settings through your browser preferences.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
                - To provide, maintain, and improve the Service.<br />
                - To personalize your experience and send you notifications about your account or changes to the Service.<br />
                - To communicate with you regarding updates, promotions, and other relevant information.<br />
                - To comply with legal obligations and enforce our terms of use.
            </p>

            <h2>3. Data Sharing</h2>
            <p>
                We do not sell, rent, or lease your personal information to third parties. However, we may share your information in the following circumstances:
                <ul>
                    <li>With service providers who assist in operating the Service.</li>
                    <li>In response to a legal request, such as a subpoena or court order.</li>
                    <li>To protect the rights, property, or safety of Buzzpilot, our users, or the public.</li>
                </ul>
            </p>

            <h2>4. Data Retention</h2>
            <p>
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. If you request account deletion, we will remove your information from our active database, subject to any legal obligations.
            </p>

            <h2>5. Security</h2>
            <p>
                We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>6. Your Rights</h2>
            <p>
                - <strong>Access</strong>: You may request a copy of the personal information we hold about you.<br />
                - <strong>Correction</strong>: You may update or correct your personal information.<br />
                - <strong>Deletion</strong>: You may request the deletion of your personal information, subject to certain limitations.<br />
                - <strong>Opt-out</strong>: You can opt-out of receiving marketing communications by following the unsubscribe instructions in our emails.
            </p>

            <h2>7. Changes to the Privacy Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will update the "Effective Date" at the top of the policy. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2>8. Children’s Privacy</h2>
            <p>
                The Service is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at [Email Address].</p>
        </div>
    );
};

export default PrivacyPolicyPage;
