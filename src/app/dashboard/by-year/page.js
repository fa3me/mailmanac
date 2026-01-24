'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

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

const CACHE_KEY = 'mailvault_by_year_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default function ByYearPage() {
    const { data: session } = useSession();
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYears, setSelectedYears] = useState([]);
    const [showExportModal, setShowExportModal] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        // Prevent multiple fetches
        if (!session || fetchedRef.current) return;

        const fetchData = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp, email } = JSON.parse(cached);
                    if (email === session.user?.email && Date.now() - timestamp < CACHE_DURATION) {
                        setYears(data);
                        setLoading(false);
                        fetchedRef.current = true;
                        return;
                    }
                }

                setLoading(true);
                const response = await fetch('/api/mail/by-year');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setYears(data.years || []);

                // Cache the result
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data.years || [],
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
    }, [session?.user?.email]); // Only refetch when email changes, not full session

    const toggleYear = (year) => {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    const selectAll = () => {
        if (selectedYears.length === years.length) {
            setSelectedYears([]);
        } else {
            setSelectedYears(years.map(y => y.year));
        }
    };

    const refreshData = () => {
        localStorage.removeItem(CACHE_KEY);
        fetchedRef.current = false;
        window.location.reload();
    };

    const selectedCount = years.filter(y => selectedYears.includes(y.year)).reduce((sum, y) => sum + y.count, 0);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-4)' }}>
                <LoadingSpinner />
                <p>Loading emails by year...</p>
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
                <button className="btn btn-primary mt-4" onClick={refreshData}>Retry</button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2>Archive by Year</h2>
                    <p style={{ marginTop: 'var(--space-2)' }}>Select years to archive or export</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={refreshData} title="Refresh data">
                        ↻
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={selectedYears.length === 0}
                        onClick={() => setShowExportModal(true)}
                    >
                        <ArchiveIcon />
                        Archive Selected ({selectedYears.length})
                    </button>
                </div>
            </div>

            {/* Select All */}
            <div className="flex justify-between items-center mb-4">
                <button className="btn btn-secondary" onClick={selectAll}>
                    {selectedYears.length === years.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedYears.length > 0 && (
                    <span style={{ color: 'var(--gray-300)' }}>
                        {selectedCount.toLocaleString()} emails selected
                    </span>
                )}
            </div>

            {/* Year Cards */}
            {years.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {years.map((yearData) => (
                        <div
                            key={yearData.year}
                            onClick={() => toggleYear(yearData.year)}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                border: selectedYears.includes(yearData.year) ? '2px solid var(--primary-500)' : undefined,
                                background: selectedYears.includes(yearData.year) ? 'rgba(99, 102, 241, 0.1)' : undefined,
                                textAlign: 'center',
                                padding: 'var(--space-6)',
                                position: 'relative'
                            }}
                        >
                            {selectedYears.includes(yearData.year) && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    width: '24px',
                                    height: '24px',
                                    background: 'var(--primary-500)',
                                    borderRadius: 'var(--radius-full)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CheckIcon />
                                </div>
                            )}
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{yearData.year}</div>
                            <div style={{ color: 'var(--primary-400)', marginTop: 'var(--space-2)' }}>
                                {yearData.count.toLocaleString()} emails
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                    <p>No email data found</p>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }} onClick={() => setShowExportModal(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-8)' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: 'var(--space-4)' }}>Export {selectedCount.toLocaleString()} Emails</h3>
                        <p style={{ marginBottom: 'var(--space-6)' }}>
                            Selected years: {selectedYears.join(', ')}
                        </p>
                        <div className="flex gap-4">
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowExportModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }}>Export Now</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
