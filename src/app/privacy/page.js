export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <h1 style={{ marginBottom: 'var(--space-8)' }}>Privacy Policy</h1>

            <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-8)' }}>
                Last Updated: January 2026
            </p>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Introduction</h2>
                <p>
                    MailManac is committed to protecting your privacy. This Privacy Policy explains how we
                    collect, use, and safeguard your information when you use our email archiving service.
                </p>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Information We Collect</h2>

                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--primary-400)' }}>Microsoft Account Information</h3>
                <p style={{ marginBottom: 'var(--space-4)' }}>When you sign in with Microsoft, we receive:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                    <li>Your name and email address</li>
                    <li>Access to your mailbox (with your permission)</li>
                    <li>Access to your OneDrive (with your permission)</li>
                </ul>

                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--primary-400)' }}>Email Data</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)' }}>
                    <li>We access emails <strong>only</strong> to display and export them</li>
                    <li>We <strong>do not store</strong> your emails on our servers</li>
                    <li>Exports are saved to <strong>your device</strong> or <strong>your OneDrive</strong></li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>What We Do NOT Store</h2>
                <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error-500)' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: 'var(--space-2)' }}>❌ Your emails or their contents</li>
                        <li style={{ marginBottom: 'var(--space-2)' }}>❌ Your email attachments</li>
                        <li>❌ Your Microsoft password</li>
                    </ul>
                </div>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Data Security</h2>
                <div className="card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success-500)' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: 'var(--space-2)' }}>✅ All data uses HTTPS/TLS encryption</li>
                        <li style={{ marginBottom: 'var(--space-2)' }}>✅ OAuth 2.0 secure authentication</li>
                        <li>✅ No sensitive data stored on our servers</li>
                    </ul>
                </div>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Your Rights</h2>
                <p>You can:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)' }}>
                    <li><strong>Revoke access</strong> at any time via <a href="https://account.live.com/consent/Manage" target="_blank" rel="noopener" style={{ color: 'var(--primary-400)' }}>Microsoft Account Settings</a></li>
                    <li><strong>Delete</strong> local preferences by clearing browser data</li>
                    <li><strong>Request information</strong> about what data we access</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy, contact us at:<br />
                    <a href="mailto:support@mailmanac.com" style={{ color: 'var(--primary-400)' }}>support@mailmanac.com</a>
                </p>
            </section>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
                <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                    By using MailManac, you agree to this Privacy Policy.
                </p>
            </div>
        </div>
    );
}
