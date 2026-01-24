'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ExportModal from '../components/ExportModal';

// Cache settings
const CACHE_KEY = 'mailvault_duplicates_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const CopyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const ArchiveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LoadingSpinner = () => (
    <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--glass-border)',
        borderTop: '3px solid var(--primary-500)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }} />
);

export default function DuplicatesPage() {
    const { data: session } = useSession();
    const [duplicates, setDuplicates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ totalDuplicates: 0, potentialSavings: 0 });
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [showExportModal, setShowExportModal] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!session || fetchedRef.current) return;

        const fetchDuplicates = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, statsData, timestamp, email } = JSON.parse(cached);
                    if (email === session.user?.email && Date.now() - timestamp < CACHE_DURATION) {
                        setDuplicates(data);
                        setStats(statsData);
                        setLoading(false);
                        fetchedRef.current = true;
                        return;
                    }
                }

                setLoading(true);
                const response = await fetch('/api/mail/duplicates');
                if (!response.ok) throw new Error('Failed to fetch duplicates');
                const data = await response.json();
                setDuplicates(data.duplicateGroups || []);
                const statsData = {
                    totalDuplicates: data.totalDuplicates || 0,
                    potentialSavings: data.potentialSavings || 0,
                };
                setStats(statsData);

                // Cache the result
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.duplicateGroups || [],
                    statsData,
                    timestamp: Date.now(),
                    email: session.user?.email
                }));
                fetchedRef.current = true;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDuplicates();
    }, [session?.user?.email]);

    const toggleGroup = (index) => {
        setSelectedGroups(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const selectAll = () => {
        if (selectedGroups.length === duplicates.length) {
            setSelectedGroups([]);
        } else {
            setSelectedGroups(duplicates.map((_, i) => i));
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const selectedDuplicateCount = selectedGroups.reduce((sum, idx) => {
        const group = duplicates[idx];
        return sum + (group ? group.count - 1 : 0); // Keep 1 original, archive the rest
    }, 0);

    const handleExport = async (deleteAfterExport, destination, onProgress) => {
        onProgress?.(10, 'Collecting duplicate emails...');

        // Collect message IDs from selected groups (skip first message in each group - keep original)
        let messageIds = [];
        selectedGroups.forEach(idx => {
            const group = duplicates[idx];
            if (group && group.messages.length > 1) {
                // Skip the first message (original), archive the duplicates
                messageIds = [...messageIds, ...group.messages.slice(1).map(m => m.id)];
            }
        });

        if (messageIds.length === 0) {
            return { error: 'No duplicate emails to archive' };
        }

        onProgress?.(30, `Exporting ${messageIds.length} duplicate emails...`);

        const exportResponse = await fetch('/api/mail/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messageIds,
                deleteAfterExport,
            }),
        });

        const result = await exportResponse.json();

        if (result.error) {
            return { error: result.error };
        }

        if (result.files && result.files.length > 0) {
            if (destination === 'onedrive') {
                onProgress?.(50, 'Uploading to OneDrive...');
                let uploadedCount = 0;

                for (const file of result.files) {
                    try {
                        const uploadResponse = await fetch('/api/onedrive/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                filename: file.filename,
                                content: file.content,
                                folderPath: 'MailManac Archives/Duplicates',
                            }),
                        });

                        if (uploadResponse.ok) {
                            uploadedCount++;
                            const progress = 50 + Math.round((uploadedCount / result.files.length) * 40);
                            onProgress?.(progress, `Uploaded ${uploadedCount} of ${result.files.length}...`);
                        }
                    } catch (err) {
                        console.error('Upload error:', err);
                    }
                }
                result.destination = 'onedrive';
            } else {
                onProgress?.(50, 'Creating archive...');

                // Dynamically load JSZip from CDN
                if (!window.JSZip) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                const zip = new window.JSZip();

                // Add all emails to the ZIP
                result.files.forEach((file, index) => {
                    zip.file(file.filename, file.content);
                });

                onProgress?.(80, 'Compressing archive...');

                // Generate ZIP file
                const zipBlob = await zip.generateAsync({ type: 'blob' });

                // Create filename for ZIP
                const date = new Date().toISOString().split('T')[0];
                const zipFilename = `duplicate_emails_${date}.zip`;

                // Download the ZIP
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = zipFilename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                result.destination = 'local';
                result.zipFilename = zipFilename;
            }
        }

        onProgress?.(90, 'Finishing up...');

        // Refresh if deleted
        if (deleteAfterExport && result.deleted > 0) {
            setSelectedGroups([]);
            const response = await fetch('/api/mail/duplicates');
            if (response.ok) {
                const data = await response.json();
                setDuplicates(data.duplicateGroups || []);
                setStats({
                    totalDuplicates: data.totalDuplicates || 0,
                    potentialSavings: data.potentialSavings || 0,
                });
            }
        }

        return result;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-4)' }}>
                <LoadingSpinner />
                <p>Scanning for duplicate emails...</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>This may take a moment</p>
                <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'rgba(239, 68, 68, 0.1)' }}>
                <h3>Error Scanning Duplicates</h3>
                <p>{error}</p>
                <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2>Duplicate Finder</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>
                        Find and archive duplicate emails to free up space
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    disabled={selectedGroups.length === 0}
                    onClick={() => setShowExportModal(true)}
                >
                    <ArchiveIcon />
                    Archive Duplicates ({selectedDuplicateCount})
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card stat-card">
                    <span className="stat-label">Duplicate Groups</span>
                    <span className="stat-value">{duplicates.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Total Duplicates</span>
                    <span className="stat-value">{stats.totalDuplicates}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Potential Savings</span>
                    <span className="stat-value">{formatSize(stats.potentialSavings)}</span>
                </div>
            </div>

            {duplicates.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✨</div>
                    <h3>No Duplicates Found!</h3>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Your mailbox is clean. No duplicate emails detected.
                    </p>
                </div>
            ) : (
                <>
                    {/* Select All */}
                    <div className="flex justify-end mb-4">
                        <button className="btn btn-secondary" onClick={selectAll}>
                            {selectedGroups.length === duplicates.length ? 'Deselect All' : `Select All (${duplicates.length})`}
                        </button>
                    </div>

                    {/* Duplicate Groups */}
                    <div className="card">
                        <div className="flex flex-col gap-3">
                            {duplicates.map((group, index) => (
                                <div
                                    key={index}
                                    onClick={() => toggleGroup(index)}
                                    style={{
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        border: selectedGroups.includes(index) ? '1px solid var(--primary-500)' : '1px solid transparent',
                                        background: selectedGroups.includes(index) ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Checkbox */}
                                        <div style={{
                                            width: '24px', height: '24px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: selectedGroups.includes(index) ? 'none' : '2px solid var(--gray-600)',
                                            background: selectedGroups.includes(index) ? 'var(--primary-500)' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {selectedGroups.includes(index) && <CheckIcon />}
                                        </div>

                                        {/* Icon */}
                                        <div style={{
                                            width: '40px', height: '40px',
                                            background: 'rgba(245, 158, 11, 0.2)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--warning-500)'
                                        }}>
                                            <CopyIcon />
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {group.subject || '(No subject)'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                From: {group.sender}
                                            </div>
                                        </div>

                                        {/* Count Badge */}
                                        <div style={{
                                            padding: 'var(--space-1) var(--space-3)',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            borderRadius: 'var(--radius-full)',
                                            color: 'var(--error-400)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {group.count} copies
                                        </div>

                                        {/* Size */}
                                        <div style={{ textAlign: 'right', minWidth: '80px', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                            ~{formatSize(group.avgSize * group.count)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                selectedCount={selectedDuplicateCount}
                selectedLabel={`Archive ${selectedDuplicateCount} duplicate emails (keeping 1 original each)`}
                onExport={handleExport}
                isGmail={session?.provider === 'google' || session?.user?.email?.includes('@gmail.com')}
            />

            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
