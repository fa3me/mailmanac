'use client';

import { useState } from 'react';

const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);

const CloudIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const FolderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

export default function ExportModal({
    isOpen,
    onClose,
    selectedCount,
    selectedLabel,
    onExport,
    isGmail = false
}) {
    const [destination, setDestination] = useState('local'); // 'local' or 'onedrive'
    const [deleteAfterExport, setDeleteAfterExport] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const handleExport = async () => {
        setExporting(true);
        setProgress(10);
        setProgressMessage('Fetching emails...');

        try {
            const exportResult = await onExport(deleteAfterExport, destination, (prog, msg) => {
                setProgress(prog);
                setProgressMessage(msg);
            });
            setProgress(100);
            setResult(exportResult);
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setExporting(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setProgress(0);
        setExporting(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }} onClick={handleClose}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '550px',
                padding: 'var(--space-8)'
            }} onClick={e => e.stopPropagation()}>

                {result ? (
                    // Result View
                    <div className="text-center">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto var(--space-6)',
                            background: result.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: result.error ? 'var(--error-500)' : 'var(--success-500)'
                        }}>
                            {result.error ? '❌' : <CheckIcon />}
                        </div>

                        <h3 style={{ marginBottom: 'var(--space-2)' }}>
                            {result.error ? 'Export Failed' : 'Export Complete!'}
                        </h3>

                        {result.error ? (
                            <p style={{ color: 'var(--error-500)' }}>{result.error}</p>
                        ) : (
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <p>Successfully exported <strong>{result.exported}</strong> emails</p>
                                {result.destination === 'onedrive' && (
                                    <div style={{
                                        marginTop: 'var(--space-4)',
                                        padding: 'var(--space-3)',
                                        background: 'rgba(0, 120, 212, 0.1)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(0, 120, 212, 0.3)'
                                    }}>
                                        <div style={{ color: 'var(--primary-400)', fontWeight: 500, marginBottom: 'var(--space-1)' }}>
                                            ☁️ Saved to OneDrive
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-300)' }}>
                                            📁 {result.savedPath || '/MailManac Archives/[Sender Name]/'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                                            Files organized in folders by sender
                                        </div>
                                    </div>
                                )}
                                {result.deleted > 0 && (
                                    <p style={{ color: 'var(--success-500)', marginTop: 'var(--space-3)' }}>
                                        🗑️ Deleted {result.deleted} emails to free up space
                                    </p>
                                )}
                            </div>
                        )}

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleClose}>
                            Close
                        </button>
                    </div>
                ) : exporting ? (
                    // Exporting View
                    <div className="text-center">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto var(--space-6)',
                            border: '4px solid var(--glass-border)',
                            borderTop: '4px solid var(--primary-500)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />

                        <h3 style={{ marginBottom: 'var(--space-4)' }}>Exporting Emails...</h3>

                        <div className="progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                            <div className="progress-fill" style={{
                                width: `${progress}%`,
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>

                        <p style={{ color: 'var(--gray-400)' }}>{progressMessage}</p>

                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : (
                    // Options View
                    <>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Export Emails</h3>
                        <p style={{ marginBottom: 'var(--space-6)', color: 'var(--gray-300)' }}>
                            {selectedLabel}
                        </p>

                        {/* Export Summary */}
                        <div className="card mb-4" style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderColor: 'var(--primary-500)'
                        }}>
                            <div className="flex items-center gap-3">
                                <DownloadIcon />
                                <div>
                                    <strong style={{ color: 'white' }}>{selectedCount} emails</strong>
                                    <span style={{ color: 'var(--gray-300)', marginLeft: 'var(--space-2)' }}>
                                        will be exported as .eml files
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Destination Options */}
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--gray-300)', fontSize: '0.875rem' }}>
                                Save to:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Local Download */}
                                <div
                                    onClick={() => setDestination('local')}
                                    style={{
                                        padding: 'var(--space-4)',
                                        background: destination === 'local' ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                                        border: destination === 'local' ? '2px solid var(--primary-500)' : '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        margin: '0 auto var(--space-2)',
                                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FolderIcon />
                                    </div>
                                    <div style={{ fontWeight: 500, color: 'white' }}>Local Download</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Save to your device</div>
                                </div>

                                {/* OneDrive */}
                                <div
                                    onClick={() => setDestination('onedrive')}
                                    style={{
                                        padding: 'var(--space-4)',
                                        background: destination === 'onedrive' ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                                        border: destination === 'onedrive' ? '2px solid var(--primary-500)' : '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        margin: '0 auto var(--space-2)',
                                        background: 'linear-gradient(135deg, #0078d4 0%, #00bcf2 100%)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CloudIcon />
                                    </div>
                                    <div style={{ fontWeight: 500, color: 'white' }}>OneDrive</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Sync across devices</div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Option */}
                        <div
                            onClick={() => setDeleteAfterExport(!deleteAfterExport)}
                            style={{
                                padding: 'var(--space-4)',
                                background: deleteAfterExport ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)',
                                border: deleteAfterExport ? '1px solid var(--error-500)' : '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                marginBottom: 'var(--space-4)'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: deleteAfterExport ? 'none' : '2px solid var(--gray-600)',
                                    background: deleteAfterExport ? 'var(--error-500)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {deleteAfterExport && <CheckIcon />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-2">
                                        <TrashIcon />
                                        <strong style={{ color: deleteAfterExport ? 'var(--error-500)' : 'white' }}>
                                            {isGmail ? 'Move to Trash after export' : 'Delete after export'}
                                        </strong>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                                        {isGmail
                                            ? 'Move emails to Trash after successful export'
                                            : 'Free up Outlook space after successful export'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {deleteAfterExport && (
                            <div className="card mb-4" style={{
                                background: 'rgba(245, 158, 11, 0.1)',
                                borderColor: 'var(--warning-500)',
                                padding: 'var(--space-3)'
                            }}>
                                {isGmail ? (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--warning-500)' }}>
                                        📧 For Gmail: Emails will be moved to Trash (not permanently deleted).
                                        Trash still counts toward storage quota until emptied.
                                        Gmail auto-deletes Trash after 30 days.
                                    </p>
                                ) : (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--warning-500)' }}>
                                        ⚠️ Emails will be permanently deleted from Outlook. Make sure your export is saved!
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleExport}
                            >
                                {destination === 'onedrive' ? <CloudIcon /> : <DownloadIcon />}
                                {destination === 'onedrive' ? 'Save to OneDrive' : 'Download'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
