export default function TermsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <h1 style={{ marginBottom: 'var(--space-8)' }}>Terms of Service</h1>

            <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-8)' }}>
                Last Updated: January 2026
            </p>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Agreement to Terms</h2>
                <p>
                    By accessing or using MailManac ("the Service"), you agree to be bound by these Terms
                    of Service. If you do not agree, do not use the Service.
                </p>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Description of Service</h2>
                <p style={{ marginBottom: 'var(--space-4)' }}>MailManac helps you:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)' }}>
                    <li>View and analyze your Microsoft 365 mailbox</li>
                    <li>Export emails to local storage or OneDrive</li>
                    <li>Manage mailbox quota by archiving old emails</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Account Requirements</h2>
                <p>To use MailManac, you must:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)' }}>
                    <li>Have a valid Microsoft account (personal or organizational)</li>
                    <li>Be at least 13 years old</li>
                    <li>Have authority to grant the requested permissions</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Your Responsibilities</h2>
                <div className="card" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--warning-500)' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: 'var(--space-2)' }}>⚠️ You are responsible for emails you choose to delete</li>
                        <li style={{ marginBottom: 'var(--space-2)' }}>⚠️ Deleted emails cannot be recovered through MailManac</li>
                        <li>⚠️ Verify exports are complete before deleting emails</li>
                    </ul>
                </div>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Acceptable Use</h2>
                <p style={{ marginBottom: 'var(--space-4)' }}>You agree NOT to:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)' }}>
                    <li>Use the Service for any illegal purpose</li>
                    <li>Attempt to access other users' data</li>
                    <li>Interfere with the Service's operation</li>
                    <li>Reverse engineer or modify the Service</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Disclaimer of Warranties</h2>
                <p>
                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not warrant
                    that the Service will be uninterrupted, error-free, or meet your specific requirements.
                </p>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Termination</h2>
                <p>
                    You may stop using the Service at any time by revoking access at{' '}
                    <a href="https://account.live.com/consent/Manage" target="_blank" rel="noopener" style={{ color: 'var(--primary-400)' }}>
                        Microsoft Account Settings
                    </a>.
                </p>
            </section>

            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Contact</h2>
                <p>
                    For questions about these Terms:<br />
                    <a href="mailto:support@mailmanac.com" style={{ color: 'var(--primary-400)' }}>support@mailmanac.com</a>
                </p>
            </section>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
                <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                    By using MailManac, you acknowledge that you have read, understood, and agree to these Terms of Service.
                </p>
            </div>
        </div>
    );
}
