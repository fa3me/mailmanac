'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

// Cache settings
const CACHE_KEY = 'mailvault_by_folder_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const FolderIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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

export default function ByFolderPage() {
    const { data: session } = useSession();
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!session || fetchedRef.current) return;

        const fetchData = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp, email } = JSON.parse(cached);
                    if (email === session.user?.email && Date.now() - timestamp < CACHE_DURATION) {
                        setFolders(data);
                        setLoading(false);
                        fetchedRef.current = true;
                        return;
                    }
                }

                setLoading(true);
                const response = await fetch('/api/mail/folders');
                if (!response.ok) throw new Error('Failed to fetch folders');
                const data = await response.json();
                setFolders(data.folders || []);

                // Cache the result
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.folders || [],
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

        fetchData();
    }, [session?.user?.email]);

    const toggleFolder = (name) => {
        setSelectedFolders(prev =>
            prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
        );
    };

    const selectedCount = folders.filter(f => selectedFolders.includes(f.name)).reduce((sum, f) => sum + f.count, 0);
    const totalSize = folders.reduce((sum, f) => sum + parseFloat(f.size), 0);
    const maxCount = Math.max(...folders.map(f => f.count), 1);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-4)' }}>
                <LoadingSpinner />
                <p>Loading folders...</p>
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
                    <h2>Archive by Folder</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>Select folders to archive or export</p>
                </div>
                <button className="btn btn-primary" disabled={selectedFolders.length === 0}>
                    <ArchiveIcon />
                    Archive Selected ({selectedFolders.length})
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="card stat-card">
                    <span className="stat-label">Total Folders</span>
                    <span className="stat-value">{folders.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Total Emails</span>
                    <span className="stat-value">{folders.reduce((s, f) => s + f.count, 0).toLocaleString()}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Total Size</span>
                    <span className="stat-value">{totalSize.toFixed(1)} MB</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Selected</span>
                    <span className="stat-value">{selectedCount}</span>
                </div>
            </div>

            {/* Folder List */}
            <div className="card">
                <div className="flex flex-col gap-2">
                    {folders.length > 0 ? (
                        folders.map((folder) => (
                            <div
                                key={folder.name}
                                onClick={() => toggleFolder(folder.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-4)',
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    border: selectedFolders.includes(folder.name) ? '1px solid var(--primary-500)' : '1px solid transparent',
                                    background: selectedFolders.includes(folder.name) ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
                                }}
                            >
                                {/* Checkbox */}
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: selectedFolders.includes(folder.name) ? 'none' : '2px solid var(--gray-600)',
                                    background: selectedFolders.includes(folder.name) ? 'var(--primary-500)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {selectedFolders.includes(folder.name) && <CheckIcon />}
                                </div>

                                {/* Folder Icon */}
                                <div style={{ color: 'var(--primary-400)' }}>
                                    <FolderIcon />
                                </div>

                                {/* Folder Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, color: 'white' }}>{folder.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                        {folder.unread > 0 && `${folder.unread} unread • `}
                                        {folder.subfolders > 0 && `${folder.subfolders} subfolders`}
                                    </div>
                                </div>

                                {/* Email Count */}
                                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                    <div style={{ fontWeight: 500, color: 'white' }}>{folder.count.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>emails</div>
                                </div>

                                {/* Size Bar */}
                                <div style={{ width: '120px' }}>
                                    <div className="progress-bar" style={{ height: '8px', marginBottom: '4px' }}>
                                        <div className="progress-fill" style={{ width: `${(folder.count / maxCount) * 100}%` }}></div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-400)', textAlign: 'right' }}>
                                        {folder.size} MB
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-400)' }}>
                            No folders found
                        </p>
                    )}
                </div>
            </div>

            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
