'use client';

import { useState } from 'react';

const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        defaultFormat: 'pst',
        defaultDestination: 'local',
        includeAttachments: true,
        compressExport: true,
        keepOriginalStructure: true,
        autoDeleteAfterExport: false,
        emailNotifications: true,
        weeklyReport: false,
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updateSetting = (key, value) => {
        setSettings({ ...settings, [key]: value });
        setSaved(false);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2>Settings</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>Configure your export and notification preferences</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? <><CheckIcon /> Saved!</> : <><SaveIcon /> Save Changes</>}
                </button>
            </div>

            {/* Export Settings */}
            <div className="card mb-6">
                <h4 style={{ marginBottom: 'var(--space-6)' }}>Export Preferences</h4>

                {/* Default Format */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--space-3)', fontWeight: 500, color: 'white' }}>
                        Default Export Format
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'pst', label: 'PST', desc: 'Outlook format' },
                            { id: 'pdf', label: 'PDF', desc: 'Document bundle' },
                            { id: 'eml', label: 'EML', desc: 'Individual files' },
                            { id: 'zip', label: 'ZIP', desc: 'Compressed archive' },
                        ].map((format) => (
                            <button
                                key={format.id}
                                onClick={() => updateSetting('defaultFormat', format.id)}
                                className={`card ${settings.defaultFormat === format.id ? '' : ''}`}
                                style={{
                                    padding: 'var(--space-4)',
                                    border: settings.defaultFormat === format.id ? '2px solid var(--primary-500)' : undefined,
                                    background: settings.defaultFormat === format.id ? 'rgba(99, 102, 241, 0.1)' : undefined,
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>{format.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>{format.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Default Destination */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--space-3)', fontWeight: 500, color: 'white' }}>
                        Default Save Location
                    </label>
                    <div className="flex flex-col gap-2">
                        {[
                            { id: 'local', label: 'Local Download', icon: '💾', desc: 'Save to your computer' },
                            { id: 'onedrive', label: 'OneDrive', icon: '☁️', desc: 'Microsoft cloud storage' },
                            { id: 'gdrive', label: 'Google Drive', icon: '📁', desc: 'Google cloud storage' },
                        ].map((dest) => (
                            <div
                                key={dest.id}
                                onClick={() => updateSetting('defaultDestination', dest.id)}
                                className="email-item"
                                style={{
                                    cursor: 'pointer',
                                    border: settings.defaultDestination === dest.id ? '1px solid var(--primary-500)' : '1px solid transparent',
                                    background: settings.defaultDestination === dest.id ? 'rgba(99, 102, 241, 0.1)' : undefined
                                }}
                            >
                                <div className="email-avatar" style={{ fontSize: '1.25rem' }}>
                                    {dest.icon}
                                </div>
                                <div className="email-content">
                                    <div className="email-sender">{dest.label}</div>
                                    <div className="email-subject">{dest.desc}</div>
                                </div>
                                {settings.defaultDestination === dest.id && (
                                    <div style={{ color: 'var(--primary-400)' }}><CheckIcon /></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggle Options */}
                <div className="flex flex-col gap-4">
                    {[
                        { key: 'includeAttachments', label: 'Include Attachments', desc: 'Export email attachments along with messages' },
                        { key: 'compressExport', label: 'Compress Export', desc: 'Reduce file size using compression' },
                        { key: 'keepOriginalStructure', label: 'Keep Folder Structure', desc: 'Preserve your mailbox folder organization' },
                        { key: 'autoDeleteAfterExport', label: 'Auto-Delete After Export', desc: 'Automatically remove emails after successful export', danger: true },
                    ].map((option) => (
                        <div
                            key={option.key}
                            className="flex justify-between items-center"
                            style={{
                                padding: 'var(--space-4)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-lg)'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 500, color: option.danger ? 'var(--error-500)' : 'white' }}>
                                    {option.label}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{option.desc}</div>
                            </div>
                            <button
                                onClick={() => updateSetting(option.key, !settings[option.key])}
                                style={{
                                    width: '56px',
                                    height: '28px',
                                    background: settings[option.key] ? 'var(--primary-600)' : 'var(--gray-700)',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'var(--transition-base)'
                                }}
                            >
                                <span style={{
                                    position: 'absolute',
                                    width: '22px',
                                    height: '22px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    top: '3px',
                                    left: settings[option.key] ? '31px' : '3px',
                                    transition: 'var(--transition-base)'
                                }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="card mb-6">
                <h4 style={{ marginBottom: 'var(--space-6)' }}>Notifications</h4>

                <div className="flex flex-col gap-4">
                    {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email when exports complete' },
                        { key: 'weeklyReport', label: 'Weekly Storage Report', desc: 'Get a weekly summary of your mailbox stats' },
                    ].map((option) => (
                        <div
                            key={option.key}
                            className="flex justify-between items-center"
                            style={{
                                padding: 'var(--space-4)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-lg)'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 500, color: 'white' }}>{option.label}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{option.desc}</div>
                            </div>
                            <button
                                onClick={() => updateSetting(option.key, !settings[option.key])}
                                style={{
                                    width: '56px',
                                    height: '28px',
                                    background: settings[option.key] ? 'var(--primary-600)' : 'var(--gray-700)',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'var(--transition-base)'
                                }}
                            >
                                <span style={{
                                    position: 'absolute',
                                    width: '22px',
                                    height: '22px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    top: '3px',
                                    left: settings[option.key] ? '31px' : '3px',
                                    transition: 'var(--transition-base)'
                                }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Connected Accounts */}
            <div className="card mb-6">
                <h4 style={{ marginBottom: 'var(--space-6)' }}>Connected Accounts</h4>

                <div className="flex flex-col gap-3">
                    <div className="email-item" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-500)' }}>
                        <div className="email-avatar" style={{ background: '#0078d4' }}>M</div>
                        <div className="email-content">
                            <div className="email-sender">Microsoft Account</div>
                            <div className="email-subject">john.doe@company.com</div>
                        </div>
                        <span className="badge badge-success">Connected</span>
                    </div>

                    <div className="email-item">
                        <div className="email-avatar" style={{ background: '#0078d4' }}>☁️</div>
                        <div className="email-content">
                            <div className="email-sender">OneDrive</div>
                            <div className="email-subject">Not connected</div>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                            Connect
                        </button>
                    </div>

                    <div className="email-item">
                        <div className="email-avatar" style={{ background: '#4285f4' }}>📁</div>
                        <div className="email-content">
                            <div className="email-sender">Google Drive</div>
                            <div className="email-subject">Not connected</div>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                            Connect
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ borderColor: 'var(--error-500)' }}>
                <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--error-500)' }}>Danger Zone</h4>

                <div className="flex justify-between items-center" style={{
                    padding: 'var(--space-4)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div>
                        <div style={{ fontWeight: 500, color: 'white' }}>Delete All Data</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                            Remove all your MailManac data and disconnect your account
                        </div>
                    </div>
                    <button className="btn" style={{
                        background: 'transparent',
                        border: '1px solid var(--error-500)',
                        color: 'var(--error-500)'
                    }}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
