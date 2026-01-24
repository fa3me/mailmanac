'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ExportModal from '../components/ExportModal';

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

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ChevronIcon = ({ expanded }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const AttachmentIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

const LoadingSpinner = () => (
    <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid var(--glass-border)',
        borderTop: '2px solid var(--primary-500)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }} />
);

const CACHE_KEY = 'mailvault_by_sender_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default function BySenderPage() {
    const { data: session } = useSession();
    const [senders, setSenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSenders, setSelectedSenders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showExportModal, setShowExportModal] = useState(false);
    const [expandedSender, setExpandedSender] = useState(null);
    const [previewEmails, setPreviewEmails] = useState([]);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [isEstimate, setIsEstimate] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!session || fetchedRef.current) return;

        const fetchData = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp, email, estimate } = JSON.parse(cached);
                    if (email === session.user?.email && Date.now() - timestamp < CACHE_DURATION) {
                        setSenders(data);
                        setIsEstimate(estimate);
                        setLoading(false);
                        fetchedRef.current = true;
                        return;
                    }
                }

                setLoading(true);
                const response = await fetch('/api/mail/by-sender');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setSenders(data.senders || []);
                setIsEstimate(data.isEstimate || false);

                // Cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.senders || [],
                    timestamp: Date.now(),
                    email: session.user?.email,
                    estimate: data.isEstimate
                }));
                fetchedRef.current = true;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.email]);

    const toggleSender = (email, e) => {
        e?.stopPropagation();
        setSelectedSenders(prev =>
            prev.includes(email) ? prev.filter(s => s !== email) : [...prev, email]
        );
    };

    const toggleExpand = async (senderEmail) => {
        if (expandedSender === senderEmail) {
            setExpandedSender(null);
            setPreviewEmails([]);
            return;
        }

        setExpandedSender(senderEmail);
        setLoadingPreview(true);

        try {
            const response = await fetch(`/api/mail/preview?sender=${encodeURIComponent(senderEmail)}`);
            if (response.ok) {
                const data = await response.json();
                setPreviewEmails(data.emails || []);
            }
        } catch (err) {
            console.error('Error loading preview:', err);
        } finally {
            setLoadingPreview(false);
        }
    };

    const filteredSenders = senders.filter(s =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectAllFiltered = () => {
        const filteredEmails = filteredSenders.map(s => s.email);
        const allSelected = filteredEmails.every(e => selectedSenders.includes(e));

        if (allSelected) {
            // Deselect all filtered
            setSelectedSenders(prev => prev.filter(e => !filteredEmails.includes(e)));
        } else {
            // Select all filtered
            setSelectedSenders(prev => [...new Set([...prev, ...filteredEmails])]);
        }
    };

    const selectedCount = senders.filter(s => selectedSenders.includes(s.email)).reduce((sum, s) => sum + s.count, 0);
    const maxCount = Math.max(...senders.map(s => s.count), 1);
    const allFilteredSelected = filteredSenders.length > 0 && filteredSenders.every(s => selectedSenders.includes(s.email));

    const handleExport = async (deleteAfterExport, destination, onProgress) => {
        let allMessageIds = [];
        let senderNames = {}; // Map email -> name for folder organization
        onProgress?.(10, 'Finding emails...');

        for (const senderEmail of selectedSenders) {
            const sender = senders.find(s => s.email === senderEmail);
            senderNames[senderEmail] = sender?.name || senderEmail;

            try {
                const response = await fetch(`/api/mail/messages?sender=${encodeURIComponent(senderEmail)}`);
                if (response.ok) {
                    const data = await response.json();
                    // Store with sender info
                    data.messages.forEach(m => {
                        allMessageIds.push({ ...m, senderEmail, senderName: senderNames[senderEmail] });
                    });
                }
            } catch (err) {
                console.error('Error fetching messages for sender:', senderEmail, err);
            }
        }

        if (allMessageIds.length === 0) {
            return { error: 'No messages found to export' };
        }

        onProgress?.(30, `Exporting ${allMessageIds.length} emails...`);

        const exportResponse = await fetch('/api/mail/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messageIds: allMessageIds.map(m => m.id),
                deleteAfterExport,
            }),
        });

        const result = await exportResponse.json();

        if (result.error) {
            return { error: result.error };
        }

        let savedPath = '';

        if (result.files && result.files.length > 0) {
            if (destination === 'onedrive') {
                onProgress?.(50, 'Uploading to OneDrive...');
                let uploadedCount = 0;

                // Group files by sender for folder organization
                for (let i = 0; i < result.files.length; i++) {
                    const file = result.files[i];
                    const msgInfo = allMessageIds[i];
                    const senderFolder = msgInfo?.senderName || 'Other';

                    try {
                        const uploadResponse = await fetch('/api/onedrive/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                filename: file.filename,
                                content: file.content,
                                folderPath: 'MailManac Archives',
                                senderFolder: senderFolder,
                            }),
                        });

                        if (uploadResponse.ok) {
                            uploadedCount++;
                            const uploadResult = await uploadResponse.json();
                            if (!savedPath && uploadResult.file?.path) {
                                savedPath = uploadResult.file.path.split('/').slice(0, -1).join('/');
                            }
                            const progress = 50 + Math.round((uploadedCount / result.files.length) * 40);
                            onProgress?.(progress, `Uploaded ${uploadedCount} of ${result.files.length}...`);
                        }
                    } catch (err) {
                        console.error('OneDrive upload error:', err);
                    }
                }

                result.destination = 'onedrive';
                result.savedPath = savedPath || '/MailManac Archives';
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
                    if (index % 10 === 0) {
                        onProgress?.(50 + Math.round((index / result.files.length) * 30), `Adding ${index + 1} of ${result.files.length} to archive...`);
                    }
                });

                onProgress?.(85, 'Compressing archive...');

                // Generate ZIP file
                const zipBlob = await zip.generateAsync({ type: 'blob' });

                // Create filename for ZIP
                const date = new Date().toISOString().split('T')[0];
                const senderLabel = selectedSenders.length === 1
                    ? senders.find(s => s.email === selectedSenders[0])?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'sender'
                    : `${selectedSenders.length}_senders`;
                const zipFilename = `emails_from_${senderLabel}_${date}.zip`;

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

        if (deleteAfterExport && result.deleted > 0) {
            setSelectedSenders([]);
            // Clear cache to get fresh data
            localStorage.removeItem(CACHE_KEY);
            fetchedRef.current = false;
            const response = await fetch('/api/mail/by-sender');
            if (response.ok) {
                const data = await response.json();
                setSenders(data.senders || []);
                // Re-cache fresh data
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.senders || [],
                    timestamp: Date.now(),
                    email: session.user?.email,
                    estimate: data.isEstimate
                }));
                fetchedRef.current = true;
            }
        }

        return result;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-4)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--primary-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p>Loading senders...</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--primary-400)' }}>This may take a moment</p>
                <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'rgba(239, 68, 68, 0.1)' }}>
                <h3>Error Loading Data</h3>
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
                    <h2>Archive by Sender</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>Click a sender to preview emails, then select to archive</p>
                </div>
                <button
                    className="btn btn-primary"
                    disabled={selectedSenders.length === 0}
                    onClick={() => setShowExportModal(true)}
                >
                    <ArchiveIcon />
                    Archive Selected ({selectedSenders.length})
                </button>
            </div>

            {/* Search & Select All */}
            <div className="flex gap-4 mb-6">
                <div className="card" style={{ padding: 'var(--space-4)', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <SearchIcon />
                        <input
                            type="text"
                            id="sender-search"
                            name="sender-search"
                            placeholder="Search senders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                width: '100%',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={selectAllFiltered}
                    disabled={filteredSenders.length === 0}
                >
                    {allFilteredSelected ? 'Deselect All' : `Select All (${filteredSenders.length})`}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card stat-card">
                    <span className="stat-label">Top 10 Senders</span>
                    <span className="stat-value">{senders.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Selected</span>
                    <span className="stat-value">{selectedSenders.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Emails Selected</span>
                    <span className="stat-value">{selectedCount.toLocaleString()}</span>
                </div>
            </div>

            {/* Sender List */}
            <div className="card">
                <div className="flex flex-col gap-2">
                    {filteredSenders.length > 0 ? (
                        filteredSenders.map((sender) => (
                            <div key={sender.email}>
                                {/* Sender Row */}
                                <div
                                    onClick={() => toggleExpand(sender.email)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        border: selectedSenders.includes(sender.email) ? '1px solid var(--primary-500)' : '1px solid transparent',
                                        background: expandedSender === sender.email
                                            ? 'rgba(99, 102, 241, 0.15)'
                                            : selectedSenders.includes(sender.email)
                                                ? 'rgba(99, 102, 241, 0.1)'
                                                : 'var(--glass-bg)'
                                    }}
                                >
                                    {/* Checkbox */}
                                    <div
                                        onClick={(e) => toggleSender(sender.email, e)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: selectedSenders.includes(sender.email) ? 'none' : '2px solid var(--gray-600)',
                                            background: selectedSenders.includes(sender.email) ? 'var(--primary-500)' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                        {selectedSenders.includes(sender.email) && <CheckIcon />}
                                    </div>

                                    {/* Avatar */}
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {sender.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {sender.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {sender.email}
                                        </div>
                                    </div>

                                    {/* Count */}
                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{sender.count}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>emails</div>
                                    </div>

                                    {/* Bar */}
                                    <div style={{ width: '100px' }}>
                                        <div className="progress-bar" style={{ height: '8px' }}>
                                            <div className="progress-fill" style={{ width: `${(sender.count / maxCount) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <ChevronIcon expanded={expandedSender === sender.email} />
                                </div>

                                {/* Expanded Email Preview */}
                                {expandedSender === sender.email && (
                                    <div style={{
                                        marginTop: 'var(--space-2)',
                                        marginLeft: 'var(--space-12)',
                                        padding: 'var(--space-4)',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        borderRadius: 'var(--radius-lg)',
                                        maxHeight: '300px',
                                        overflow: 'auto'
                                    }}>
                                        {loadingPreview ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                                                <LoadingSpinner />
                                                <span>Loading emails...</span>
                                            </div>
                                        ) : previewEmails.length > 0 ? (
                                            previewEmails.map((email, i) => (
                                                <div key={email.id} style={{
                                                    padding: 'var(--space-3)',
                                                    borderBottom: i < previewEmails.length - 1 ? '1px solid var(--glass-border)' : 'none'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                                        <div style={{ fontWeight: 500, color: 'white', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {email.hasAttachments && <AttachmentIcon />} {email.subject}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginLeft: 'var(--space-4)' }}>
                                                            {formatDate(email.date)}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {email.preview}...
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: 'var(--gray-400)', padding: 'var(--space-4)' }}>No emails found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-400)' }}>
                            {searchQuery ? 'No senders match your search' : 'No senders found'}
                        </p>
                    )}
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                selectedCount={selectedCount}
                selectedLabel={`Export emails from ${selectedSenders.length} selected sender(s)`}
                onExport={handleExport}
                isGmail={session?.provider === 'google' || session?.user?.email?.includes('@gmail.com')}
            />

            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
