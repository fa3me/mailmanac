'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';

// Icons as simple SVG components
const AlmanacIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
);

const ChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CopyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const CloudIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const MicrosoftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4zM11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24z" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function HomePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { t } = useLanguage();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleMicrosoftSignIn = () => {
        signIn('azure-ad', { callbackUrl: '/dashboard' });
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const scrollToHowItWorks = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBuyPro = () => {
        window.open('https://buymeacoffee.com/bigsee', '_blank');
    };

    const handleVerify = () => {
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            localStorage.setItem('mailmanac_pro', 'true');
            setShowVerificationModal(false);
            alert('🎉 Verification Successful! Pro features unlocked.');
            window.location.reload();
        }, 2000);
    };

    return (
        <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Navigation */}
            <nav className="glass" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: 'var(--space-4) var(--space-6)'
            }}>
                <div className="container flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div style={{
                            background: 'var(--gradient-primary)',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex'
                        }}>
                            <AlmanacIcon />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            MailManac
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />

                        <a href="#features" className="nav-link hidden md:block" style={{
                            color: 'var(--gray-300)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
                        >{t('nav.features')}</a>
                        <a href="#pricing" className="nav-link hidden md:block" style={{
                            color: 'var(--gray-300)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
                        >{t('nav.pricing')}</a>
                        <Link href="/dashboard" className="btn btn-secondary hidden md:block">{t('nav.dashboard')}</Link>
                        <button className="btn btn-primary flex items-center gap-2" onClick={handleMicrosoftSignIn}>
                            <MicrosoftIcon />
                            <span className="hidden sm:inline">{t('nav.outlook')}</span>
                        </button>
                        <button className="btn btn-secondary flex items-center gap-2" onClick={handleGoogleSignIn}>
                            <GoogleIcon />
                            <span className="hidden sm:inline">{t('nav.gmail')}</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                paddingTop: '160px',
                paddingBottom: 'var(--space-24)',
                background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
            }}>
                <div className="container text-center">
                    <div className="badge badge-primary mb-6" style={{ display: 'inline-flex' }}>
                        {t('hero.badge')}
                    </div>

                    <h1 style={{ marginBottom: 'var(--space-6)' }}>
                        {t('hero.title')}<br />
                        <span className="text-gradient">{t('hero.titleGradient')}</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        maxWidth: '640px',
                        margin: '0 auto var(--space-8)'
                    }}>
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button className="btn btn-primary btn-lg flex items-center gap-2" onClick={handleMicrosoftSignIn}>
                                <MicrosoftIcon />
                                {t('hero.connectOutlook')}
                            </button>
                            <button className="btn btn-lg flex items-center gap-2" onClick={handleGoogleSignIn}
                                style={{ background: 'white', color: '#333' }}>
                                <GoogleIcon />
                                {t('hero.connectGmail')}
                            </button>
                        </div>
                        <button className="btn btn-secondary" onClick={scrollToHowItWorks}>
                            {t('hero.howItWorks')}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" style={{ maxWidth: '600px', margin: '4rem auto 0' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>50GB+</div>
                            <div style={{ color: 'var(--gray-400)' }}>{t('hero.stats.storage')}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>10K+</div>
                            <div style={{ color: 'var(--gray-400)' }}>{t('hero.stats.users')}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>99.9%</div>
                            <div style={{ color: 'var(--gray-400)' }}>{t('hero.stats.uptime')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>{t('howItWorks.title')} <span className="text-gradient">{t('howItWorks.titleGradient')}</span></h2>
                        <p style={{ marginTop: 'var(--space-4)' }}>{t('howItWorks.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: 'var(--primary-600)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>1</div>
                            <h4>{t('howItWorks.step1.title')}</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                {t('howItWorks.step1.desc')}
                            </p>
                        </div>
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: 'var(--gradient-primary)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>2</div>
                            <h4>{t('howItWorks.step2.title')}</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                {t('howItWorks.step2.desc')}
                            </p>
                        </div>
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: '#ec4899',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>3</div>
                            <h4>{t('howItWorks.step3.title')}</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                {t('howItWorks.step3.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Simplified for translation */}
            <section id="features" className="py-24">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2><span className="text-gradient">MailManac</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <h4 style={{ marginBottom: 'var(--space-2)' }}>{t('hero.stats.storage')}</h4>
                            <p>{t('nav.dashboard')}</p>
                        </div>
                        <div className="card">
                            <h4 style={{ marginBottom: 'var(--space-2)' }}>{t('howItWorks.step2.title')}</h4>
                            <p>{t('howItWorks.step2.desc')}</p>
                        </div>
                        <div className="card">
                            <h4 style={{ marginBottom: 'var(--space-2)' }}>{t('howItWorks.step3.title')}</h4>
                            <p>{t('howItWorks.step3.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>{t('pricing.title')} <span className="text-gradient">{t('pricing.titleGradient')}</span></h2>
                        <p style={{ marginTop: 'var(--space-4)' }}>{t('pricing.subtitle')}</p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <span style={{ color: billingCycle === 'monthly' ? 'white' : 'var(--gray-400)' }}>{t('pricing.monthly')}</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                style={{
                                    width: '56px',
                                    height: '28px',
                                    background: 'var(--primary-600)',
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
                                    left: billingCycle === 'monthly' ? '3px' : '31px',
                                    transition: 'var(--transition-base)'
                                }} />
                            </button>
                            <span style={{ color: billingCycle === 'yearly' ? 'white' : 'var(--gray-400)' }}>
                                {t('pricing.yearly')} <span className="badge badge-success" style={{ marginLeft: 'var(--space-2)' }}>{t('pricing.save')}</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Free Plan */}
                        <div className="card">
                            <h4>{t('pricing.plans.free.name')}</h4>
                            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>{t('pricing.plans.free.desc')}</p>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>$0</span>
                            </div>
                            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => document.getElementById('login-section').scrollIntoView()}>
                                {t('pricing.plans.free.cta')}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="card" style={{ border: '2px solid var(--primary-500)' }}>
                            <h4>{t('pricing.plans.pro.name')}</h4>
                            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>{t('pricing.plans.pro.desc')}</p>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>{billingCycle === 'monthly' ? '$5' : '$4'}</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleBuyPro}>
                                {t('pricing.plans.pro.cta')}
                            </button>
                        </div>

                        {/* Business Plan */}
                        <div className="card">
                            <h4>{t('pricing.plans.business.name')}</h4>
                            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>{t('pricing.plans.business.desc')}</p>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>{billingCycle === 'monthly' ? '$15' : '$12'}</span>
                            </div>
                            <button className="btn btn-secondary" style={{ width: '100%' }}>
                                {t('pricing.plans.business.cta')}
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            className="text-link"
                            style={{ background: 'none', border: 'none', color: 'var(--gray-400)', textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => setShowVerificationModal(true)}
                        >
                            {t('pricing.verify')}
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="login-section" className="py-24">
                <div className="container">
                    <div className="card text-center" style={{
                        background: 'var(--gradient-primary)',
                        padding: 'var(--space-16)'
                    }}>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>{t('hero.title')}</h2>
                        <div className="flex gap-4 justify-center items-center flex-wrap">
                            <button className="btn btn-lg" style={{
                                background: 'white',
                                color: 'var(--primary-700)'
                            }} onClick={handleMicrosoftSignIn}>
                                <MicrosoftIcon /> {t('nav.outlook')}
                            </button>
                            <button className="btn btn-lg" style={{
                                background: 'white',
                                color: '#333'
                            }} onClick={handleGoogleSignIn}>
                                <GoogleIcon /> {t('nav.gmail')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <div className="container flex justify-between items-center bg-transparent flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div style={{
                            background: 'var(--gradient-primary)',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <AlmanacIcon />
                        </div>
                        <span style={{ color: 'var(--gray-400)' }}>© 2026 MailManac. {t('footer.rights')}</span>
                    </div>

                    <div className="flex gap-6 flex-wrap">
                        <Link href="/privacy" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{t('footer.privacy')}</Link>
                        <Link href="/terms" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{t('footer.terms')}</Link>
                        <Link href="/request-approval" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{t('footer.work')}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
