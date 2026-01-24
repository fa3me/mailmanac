'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

// Cache settings
const CACHE_KEY = 'mailvault_overview_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Icons
const ArchiveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
);

const TrendUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
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

export default function DashboardPage() {
    const { data: session } = useSession();
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mailData, setMailData] = useState(null);
    const fetchedRef = useRef(false);

    // Fetch real mail data - detect provider
    useEffect(() => {
        if (!session || fetchedRef.current) return;

        const fetchMailData = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp, email } = JSON.parse(cached);
                    if (email === session.user?.email && Date.now() - timestamp < CACHE_DURATION) {
                        setMailData(data);
                        setLoading(false);
                        fetchedRef.current = true;
                        return;
                    }
                }

                setLoading(true);

                // Detect provider from session
                const isGmail = session?.provider === 'google' ||
                    session?.user?.email?.includes('@gmail.com') ||
                    session?.user?.email?.includes('@googlemail.com');

                const apiUrl = isGmail ? '/api/gmail' : '/api/mail';
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to fetch mail data');
                }
                const data = await response.json();
                setMailData(data);

                // Cache the result
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now(),
                    email: session.user?.email
                }));
                fetchedRef.current = true;
            } catch (err) {
                console.error('Error fetching mail:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMailData();
    }, [session?.user?.email]);

    // Calculate quota
    const stats = mailData?.stats || { storageUsed: 0, storageTotal: 50, totalEmails: 0 };
    const quotaPercentage = (parseFloat(stats.storageUsed) / stats.storageTotal) * 100;
    const circumference = 2 * Math.PI * 78;
    const strokeDashoffset = circumference - (quotaPercentage / 100) * circumference;

    // Get user name from session
    const userName = session?.user?.name?.split(' ')[0] || 'User';

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: 'var(--space-4)'
            }}>
                <LoadingSpinner />
                <p>Loading your mailbox data...</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--primary-400)' }}>This may take a moment</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{
                textAlign: 'center',
                padding: 'var(--space-12)',
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'var(--error-500)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Error Loading Mail Data</h3>
                <p style={{ marginBottom: 'var(--space-4)' }}>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    const topSenders = mailData?.topSenders || [];
    const folders = mailData?.folders || [];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2>Welcome back, {userName} 👋</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>Here's what's happening with your mailbox</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowArchiveModal(true)}>
                    <ArchiveIcon />
                    Quick Archive
                </button>
            </div>

            {/* Quota Warning */}
            {quotaPercentage > 75 && (
                <div className="card mb-6" style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderColor: 'var(--warning-500)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)'
                }}>
                    <div style={{ color: 'var(--warning-500)' }}><AlertIcon /></div>
                    <div style={{ flex: 1 }}>
                        <strong style={{ color: 'var(--warning-500)' }}>Quota Warning:</strong>
                        <span style={{ marginLeft: 'var(--space-2)' }}>
                            Your mailbox is {quotaPercentage.toFixed(0)}% full. Consider archiving old emails to free up space.
                        </span>
                    </div>
                    <button className="btn btn-secondary" style={{ flexShrink: 0 }}>Archive Now</button>
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: 'auto 1fr' }}>
                {/* Quota Circle */}
                <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <div className="quota-ring" style={{ margin: '0 auto' }}>
                        <svg width="180" height="180" viewBox="0 0 180 180">
                            <defs>
                                <linearGradient id="quotaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                            <circle cx="90" cy="90" r="78" className="quota-ring-bg" />
                            <circle
                                cx="90" cy="90" r="78"
                                className="quota-ring-fill"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset
                                }}
                            />
                        </svg>
                        <div className="quota-text">
                            <div className="quota-percentage">{quotaPercentage.toFixed(0)}%</div>
                            <div className="quota-label">Used</div>
                        </div>
                    </div>
                    <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                        <strong style={{ color: 'white' }}>{stats.storageUsed} GB</strong> of {stats.storageTotal} GB
                    </p>
                    <div className="progress-bar mt-4">
                        <div className="progress-fill" style={{ width: `${quotaPercentage}%` }}></div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="card stat-card">
                        <span className="stat-label">Total Emails</span>
                        <span className="stat-value">{stats.totalEmails?.toLocaleString() || 0}</span>
                        <span className="stat-trend positive">
                            <TrendUpIcon /> Across all folders
                        </span>
                    </div>

                    <div className="card stat-card">
                        <span className="stat-label">Inbox Count</span>
                        <span className="stat-value">{stats.inboxCount?.toLocaleString() || 0}</span>
                        <span className="stat-trend positive">
                            Primary inbox
                        </span>
                    </div>

                    <div className="card stat-card">
                        <span className="stat-label">Top Senders</span>
                        <span className="stat-value">{topSenders.length}</span>
                        <span className="stat-trend positive">
                            Unique senders
                        </span>
                    </div>

                    <div className="card stat-card">
                        <span className="stat-label">Folders</span>
                        <span className="stat-value">{folders.length}</span>
                        <span className="stat-trend positive">
                            Mail folders
                        </span>
                    </div>
                </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Top Senders */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h4>Top Senders</h4>
                        <a href="/dashboard/by-sender" style={{ fontSize: '0.875rem' }}>View all →</a>
                    </div>

                    <div className="flex flex-col gap-3">
                        {topSenders.length > 0 ? (
                            topSenders.slice(0, 5).map((sender, index) => (
                                <div key={index} className="email-item">
                                    <div className="email-avatar">
                                        {sender.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="email-content">
                                        <div className="email-sender">{sender.email}</div>
                                        <div className="email-subject">{sender.count} emails</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--gray-400)' }}>No sender data available</p>
                        )}
                    </div>
                </div>

                {/* Folders */}
                <div className="card">
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Mail Folders</h4>

                    <div className="flex flex-col gap-3">
                        {folders.length > 0 ? (
                            folders.slice(0, 5).map((folder, index) => (
                                <div key={index} className="email-item">
                                    <div className="email-avatar" style={{ background: 'var(--primary-600)' }}>📁</div>
                                    <div className="email-content">
                                        <div className="email-sender">{folder.name}</div>
                                        <div className="email-subject">{folder.count?.toLocaleString()} emails</div>
                                    </div>
                                    <div className="email-meta">
                                        <div className="email-size">{folder.size} GB</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--gray-400)' }}>No folders found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mt-6">
                <h4 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h4>
                <div className="grid grid-cols-4 gap-4">
                    <a href="/dashboard/by-year" className="card text-center" style={{
                        padding: 'var(--space-6)',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto var(--space-3)',
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            📅
                        </div>
                        <div style={{ fontWeight: 500, color: 'white' }}>Archive by Year</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                            Clean up old emails
                        </div>
                    </a>

                    <a href="/dashboard/by-sender" className="card text-center" style={{
                        padding: 'var(--space-6)',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto var(--space-3)',
                            background: 'var(--gradient-accent)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            👥
                        </div>
                        <div style={{ fontWeight: 500, color: 'white' }}>Archive by Sender</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                            Batch clean newsletters
                        </div>
                    </a>

                    <a href="/dashboard/duplicates" className="card text-center" style={{
                        padding: 'var(--space-6)',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto var(--space-3)',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            📋
                        </div>
                        <div style={{ fontWeight: 500, color: 'white' }}>Find Duplicates</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                            Remove wasted space
                        </div>
                    </a>

                    <a href="/dashboard/by-folder" className="card text-center" style={{
                        padding: 'var(--space-6)',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto var(--space-3)',
                            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            📁
                        </div>
                        <div style={{ fontWeight: 500, color: 'white' }}>By Folder</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                            Archive by location
                        </div>
                    </a>
                </div>
            </div>

            {/* Archive Modal */}
            {showArchiveModal && (
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
                }} onClick={() => setShowArchiveModal(false)}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: 'var(--space-8)'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: 'var(--space-6)' }}>Quick Archive</h3>

                        <div className="flex flex-col gap-4">
                            <a href="/dashboard/by-year" className="email-item" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                <div className="email-avatar">📅</div>
                                <div className="email-content">
                                    <div className="email-sender">Archive by Year</div>
                                    <div className="email-subject">Clean up old emails</div>
                                </div>
                            </a>

                            <a href="/dashboard/duplicates" className="email-item" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                <div className="email-avatar">📋</div>
                                <div className="email-content">
                                    <div className="email-sender">Remove Duplicates</div>
                                    <div className="email-subject">Free up wasted space</div>
                                </div>
                            </a>

                            <a href="/dashboard/by-sender" className="email-item" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                <div className="email-avatar">📧</div>
                                <div className="email-content">
                                    <div className="email-sender">Archive by Sender</div>
                                    <div className="email-subject">Clean newsletters & bulk mail</div>
                                </div>
                            </a>
                        </div>

                        <button className="btn btn-secondary mt-6" style={{ width: '100%' }} onClick={() => setShowArchiveModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
