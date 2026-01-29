'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function HowToFixMailboxFull() {
    const { t } = useLanguage();

    return (
        <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Navigation */}
            <nav className="glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                padding: 'var(--space-4) var(--space-6)'
            }}>
                <div className="container flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'var(--gradient-primary)',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
                                <path d="M3 8L12 13L21 8" stroke="white" strokeWidth="2" />
                                <line x1="7" y1="12" x2="7" y2="17" stroke="white" strokeWidth="1.5" />
                                <line x1="12" y1="15" x2="12" y2="17" stroke="white" strokeWidth="1.5" />
                                <line x1="17" y1="12" x2="17" y2="17" stroke="white" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            MailManac
                        </span>
                    </Link>
                    <Link href="/" className="btn btn-primary">
                        Try Free Tool →
                    </Link>
                </div>
            </nav>

            {/* Article Content */}
            <article className="container" style={{ maxWidth: '800px', padding: 'var(--space-12) var(--space-6)' }}>

                {/* Breadcrumb */}
                <nav style={{ marginBottom: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                    <Link href="/" style={{ color: 'var(--primary-400)', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 var(--space-2)' }}>→</span>
                    <span>How to Fix Mailbox Full</span>
                </nav>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-4)',
                    lineHeight: 1.2
                }}>
                    How to Fix <span className="text-gradient">Mailbox Full</span> Error in Gmail & Outlook (2026 Guide)
                </h1>

                {/* Meta */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-8)',
                    color: 'var(--gray-400)',
                    fontSize: '0.875rem',
                    flexWrap: 'wrap'
                }}>
                    <span>📅 Updated: January 2026</span>
                    <span>⏱️ 5 min read</span>
                    <span>👁️ 10K+ readers helped</span>
                </div>

                {/* Hero Box */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.1) 100%)',
                    marginBottom: 'var(--space-8)',
                    border: '1px solid var(--primary-500)'
                }}>
                    <p style={{ fontSize: '1.125rem', margin: 0 }}>
                        <strong>Quick Fix:</strong> Your mailbox is full because old emails are taking up space.
                        Use <Link href="/" style={{ color: 'var(--primary-400)' }}>MailManac</Link> to instantly archive emails
                        by year, sender, or folder — <strong>100% free</strong>.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>📑 Table of Contents</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: 'var(--space-2) 0' }}><a href="#why-mailbox-full" style={{ color: 'var(--primary-400)' }}>1. Why is my mailbox full?</a></li>
                        <li style={{ padding: 'var(--space-2) 0' }}><a href="#fix-gmail" style={{ color: 'var(--primary-400)' }}>2. How to fix Gmail storage full</a></li>
                        <li style={{ padding: 'var(--space-2) 0' }}><a href="#fix-outlook" style={{ color: 'var(--primary-400)' }}>3. How to fix Outlook mailbox full</a></li>
                        <li style={{ padding: 'var(--space-2) 0' }}><a href="#best-tool" style={{ color: 'var(--primary-400)' }}>4. Best free tool to clean up emails</a></li>
                        <li style={{ padding: 'var(--space-2) 0' }}><a href="#prevent" style={{ color: 'var(--primary-400)' }}>5. How to prevent mailbox full in the future</a></li>
                    </ul>
                </div>

                {/* Section 1 */}
                <section id="why-mailbox-full" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2>1. Why is My Mailbox Full? 📭</h2>
                    <p>The "mailbox full" or "storage quota exceeded" error appears when you've used all your available email storage. Here's what's eating your space:</p>

                    <ul>
                        <li><strong>Large attachments</strong> — PDFs, images, and videos in emails</li>
                        <li><strong>Years of old emails</strong> — Newsletters, promotions, receipts</li>
                        <li><strong>Trash not emptied</strong> — Deleted emails still count against quota</li>
                        <li><strong>Spam folder</strong> — Accumulated spam takes up space</li>
                        <li><strong>Google Drive/Photos</strong> — For Gmail, these share the same 15GB</li>
                    </ul>

                    <div className="card" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                        <p style={{ margin: 0 }}>
                            💡 <strong>Pro tip:</strong> Gmail's 15GB is shared between Gmail, Google Drive, and Google Photos.
                            A few large Drive files can fill your "email" storage!
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section id="fix-gmail" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2>2. How to Fix Gmail Storage Full ✉️</h2>

                    <h3>Method 1: Delete Large Emails (Manual)</h3>
                    <ol>
                        <li>In Gmail, search: <code>has:attachment larger:10M</code></li>
                        <li>Select and delete emails with large attachments</li>
                        <li>Empty Trash (important!)</li>
                    </ol>

                    <h3>Method 2: Delete Old Emails (Manual)</h3>
                    <ol>
                        <li>Search: <code>older_than:2y</code> (emails older than 2 years)</li>
                        <li>Select all and delete</li>
                        <li>Empty Trash</li>
                    </ol>

                    <h3>Method 3: Use MailManac (Recommended - Free)</h3>
                    <p>Instead of manually searching and deleting, use MailManac to:</p>
                    <ul>
                        <li>✅ See all emails organized by year, sender, or folder</li>
                        <li>✅ Archive in bulk to Google Drive</li>
                        <li>✅ Find duplicate emails wasting space</li>
                        <li>✅ Keep a backup before deleting anything</li>
                    </ul>

                    <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}>
                        Try MailManac Free →
                    </Link>
                </section>

                {/* Section 3 */}
                <section id="fix-outlook" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2>3. How to Fix Outlook Mailbox Full 📧</h2>

                    <h3>For Outlook.com / Microsoft 365:</h3>
                    <ol>
                        <li>Go to <strong>Settings → View all Outlook settings</strong></li>
                        <li>Click <strong>General → Storage</strong></li>
                        <li>See what's using space and clean up</li>
                    </ol>

                    <h3>For Outlook Desktop:</h3>
                    <ol>
                        <li>Go to <strong>File → Tools → Mailbox Cleanup</strong></li>
                        <li>Use "Find items older than" to locate old emails</li>
                        <li>Archive or delete as needed</li>
                    </ol>

                    <h3>Or use MailManac (Works with Outlook too!):</h3>
                    <p>MailManac connects to your Outlook account and helps you archive emails to OneDrive automatically.</p>
                </section>

                {/* Section 4 */}
                <section id="best-tool" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2>4. Best Free Tool to Clean Up Emails 🛠️</h2>

                    <div className="card" style={{ border: '2px solid var(--primary-500)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            <div style={{
                                background: 'var(--gradient-primary)',
                                padding: 'var(--space-2)',
                                borderRadius: 'var(--radius-lg)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
                                    <path d="M3 8L12 13L21 8" stroke="white" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 style={{ margin: 0 }}>MailManac — Free Email Archiving Tool</h3>
                        </div>

                        <p><strong>Why MailManac is the best choice:</strong></p>
                        <ul>
                            <li>🎁 <strong>100% Free</strong> — No paid plans, no limits</li>
                            <li>📊 <strong>Visual Dashboard</strong> — See emails by year, sender, folder</li>
                            <li>☁️ <strong>Cloud Export</strong> — Archive to Google Drive or OneDrive</li>
                            <li>🔍 <strong>Find Duplicates</strong> — Remove duplicate emails</li>
                            <li>🔒 <strong>Privacy First</strong> — No data stored on our servers</li>
                            <li>⚡ <strong>Fast</strong> — Archive thousands of emails in minutes</li>
                        </ul>

                        <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}>
                            Get Started Free →
                        </Link>
                    </div>
                </section>

                {/* Section 5 */}
                <section id="prevent" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2>5. How to Prevent Mailbox Full in the Future 🛡️</h2>

                    <ol>
                        <li><strong>Unsubscribe from newsletters</strong> you don't read</li>
                        <li><strong>Set up filters</strong> to auto-delete promotional emails</li>
                        <li><strong>Archive yearly</strong> — Use MailManac to archive emails at the end of each year</li>
                        <li><strong>Empty Trash regularly</strong> — Set a monthly reminder</li>
                        <li><strong>Use Google Drive wisely</strong> — Remember it shares quota with Gmail</li>
                    </ol>
                </section>

                {/* CTA */}
                <section className="card" style={{
                    background: 'var(--gradient-primary)',
                    textAlign: 'center',
                    padding: 'var(--space-12)'
                }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Fix Your Mailbox? 🚀</h2>
                    <p style={{ marginBottom: 'var(--space-6)', opacity: 0.9 }}>
                        Join 10,000+ users who've freed up their email storage with MailManac.
                    </p>
                    <Link href="/" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-700)' }}>
                        Start Free — No Credit Card Needed
                    </Link>
                </section>

                {/* FAQ Schema */}
                <section style={{ marginTop: 'var(--space-12)' }}>
                    <h2>Frequently Asked Questions</h2>

                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)' }}>Q: Is MailManac really free?</h3>
                        <p style={{ margin: 0, color: 'var(--gray-300)' }}>Yes! MailManac is 100% free with no hidden costs or paid tiers. We accept optional donations via Buy Me a Coffee.</p>
                    </div>

                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)' }}>Q: Is it safe to connect my Gmail/Outlook?</h3>
                        <p style={{ margin: 0, color: 'var(--gray-300)' }}>Yes. We use official OAuth authentication. Your password is never stored. You can revoke access anytime from your Google/Microsoft account settings.</p>
                    </div>

                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)' }}>Q: Will my emails be deleted?</h3>
                        <p style={{ margin: 0, color: 'var(--gray-300)' }}>No. MailManac archives (exports) your emails to cloud storage. Your original emails stay in your inbox unless you manually delete them.</p>
                    </div>
                </section>

            </article>

            {/* Footer */}
            <footer className="py-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <div className="container text-center" style={{ color: 'var(--gray-400)' }}>
                    <p>© 2026 MailManac. Free email archiving for everyone.</p>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <Link href="/privacy" style={{ color: 'var(--gray-400)', marginRight: 'var(--space-4)' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: 'var(--gray-400)' }}>Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
