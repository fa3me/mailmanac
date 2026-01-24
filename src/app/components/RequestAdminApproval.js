'use client';

import { useState } from 'react';

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function RequestAdminApproval({ userEmail = '' }) {
    const [adminEmail, setAdminEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);

    const APP_NAME = 'MailManac';
    const APP_ID = '2bdfce50-8306-4432-a84d-ca2cfbcd86fb';

    const permissions = [
        { name: 'User.Read', desc: 'Read user profile' },
        { name: 'Mail.Read', desc: 'Read email messages' },
        { name: 'Mail.ReadWrite', desc: 'Archive and delete emails' },
        { name: 'Files.ReadWrite', desc: 'Save to OneDrive' },
    ];

    const emailSubject = `Request for Admin Approval: ${APP_NAME} Email Archiving App`;

    const emailBody = `Hi IT Team,

I would like to request admin approval for the ${APP_NAME} application to help manage my mailbox quota.

**Application Details:**
- Name: ${APP_NAME}
- App ID: ${APP_ID}
- Purpose: Email archiving and mailbox management
- Vendor Website: https://mailmanac.com

**Permissions Requested:**
${permissions.map(p => `- ${p.name}: ${p.desc}`).join('\n')}

**Admin Consent URL:**
https://login.microsoftonline.com/common/adminconsent?client_id=${APP_ID}

**Documentation:**
- IT Admin Guide: https://mailmanac.com/docs/it-admin
- Privacy Policy: https://mailmanac.com/privacy
- Terms of Service: https://mailmanac.com/terms

Please grant consent for this application so I can use it to manage my email storage.

Thank you,
${userEmail || '[Your Name]'}`;

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailBody);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = () => {
        if (!adminEmail) return;

        const mailtoUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl, '_blank');
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-8)' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto var(--space-4)',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--warning-500)',
                    fontSize: '2rem'
                }}>
                    🔐
                </div>
                <h2 style={{ marginBottom: 'var(--space-2)' }}>Admin Approval Required</h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Your organization requires IT admin approval to use this app.
                </p>
            </div>

            {/* Permissions List */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ marginBottom: 'var(--space-3)' }}>Permissions Requested:</h4>
                <div className="flex flex-col gap-2">
                    {permissions.map(p => (
                        <div key={p.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            background: 'var(--glass-bg)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <code style={{
                                background: 'rgba(99, 102, 241, 0.2)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem'
                            }}>
                                {p.name}
                            </code>
                            <span style={{ color: 'var(--gray-300)', fontSize: '0.875rem' }}>{p.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Request Form */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                    IT Admin Email:
                </label>
                <input
                    type="email"
                    placeholder="it-admin@yourcompany.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleSendEmail}
                    disabled={!adminEmail}
                >
                    <MailIcon />
                    Send Request Email
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleCopyEmail}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* Email Preview */}
            <details style={{ marginBottom: 'var(--space-4)' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--primary-400)', marginBottom: 'var(--space-2)' }}>
                    Preview email content
                </summary>
                <pre style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--gray-300)',
                    maxHeight: '200px',
                    overflow: 'auto'
                }}>
                    {emailBody}
                </pre>
            </details>

            {/* Help Text */}
            <div style={{
                padding: 'var(--space-4)',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--primary-500)'
            }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-300)', margin: 0 }}>
                    <strong>What happens next?</strong><br />
                    Your IT admin will receive an email with a link to approve the app.
                    Once approved, you can sign in with your work account.
                </p>
            </div>
        </div>
    );
}
