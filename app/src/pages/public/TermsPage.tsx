import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="terms-container container p-4">
            <h1 className='font-bold text-2xl'>Terms and Conditions</h1>
            <p><strong>Effective Date</strong>: 5 March 2025</p>

            <h2>1. Eligibility</h2>
            <p>
                You must be at least 18 years old to use the Service. By agreeing to these Terms, you represent and warrant that you are 18 years of age or older, and that you are legally capable of entering into a binding contract.
            </p>

            <h2>2. Account Creation</h2>
            <p>
                To use the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update your information if it changes.
            </p>

            <h2>3. License to Use the Service</h2>
            <p>
                Buzzpilot grants you a non-exclusive, non-transferable, revocable license to access and use the Service in accordance with these Terms for personal or business purposes. You may not sublicense, resell, or distribute the Service without our express written permission.
            </p>

            <h2>4. User Content</h2>
            <p>
                You retain all rights to the content you post on Buzzpilot, including text, images, and videos ("User Content"). By submitting User Content, you grant Buzzpilot a worldwide, royalty-free, and non-exclusive license to use, display, and distribute such content through the Service.
            </p>

            <h2>5. Prohibited Use</h2>
            <p>
                You agree not to:
                <ul>
                    <li>Violate any applicable laws or regulations.</li>
                    <li>Infringe the intellectual property rights of others.</li>
                    <li>Upload or transmit harmful or malicious content.</li>
                    <li>Engage in spamming, harassment, or abusive conduct.</li>
                    <li>Use the Service to distribute malware or malicious code.</li>
                </ul>
            </p>

            <h2>6. Privacy</h2>
            <p>
                Your use of the Service is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which outlines how we collect, use, and protect your information.
            </p>

            <h2>7. Termination</h2>
            <p>
                We may suspend or terminate your access to the Service at any time, for any reason, without notice, including if you violate these Terms. Upon termination, you must cease all use of the Service and delete any associated content.
            </p>

            <h2>8. Disclaimers</h2>
            <p>
                The Service is provided "as is" and "as available," without any warranties or guarantees. We disclaim all warranties, express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
                Buzzpilot will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
            </p>

            <h2>10. Changes to the Terms</h2>
            <p>
                We may update or modify these Terms at any time. We will notify you of significant changes, but it is your responsibility to review these Terms periodically.
            </p>

            <h2>11. Governing Law</h2>
            <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
            </p>

            <h2>12. Contact Us</h2>
            <p>If you have any questions or concerns about these Terms, please contact us at [Email Address].</p>
        </div>
    );
};

export default TermsPage;
