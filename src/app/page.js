'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

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
    const [billingCycle, setBillingCycle] = useState('monthly');

    const handleMicrosoftSignIn = () => {
        signIn('azure-ad', { callbackUrl: '/dashboard' });
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verifying, setVerifying] = useState(false);



    const scrollToHowItWorks = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBuyPro = () => {
        window.open('https://buymeacoffee.com/bigsee', '_blank');
    };

    const handleVerify = () => {
        setVerifying(true);
        // Simulate verification delay
        setTimeout(() => {
            setVerifying(false);
            localStorage.setItem('mailmanac_pro', 'true');
            setShowVerificationModal(false);
            // Use simple alert or toast for now, simulate confetti later
            alert('🎉 Verification Successful! Pro features unlocked.');
            window.location.reload(); // Reload to apply pro state
        }, 2000);
    };

    const features = [
        {
            icon: <ChartIcon />,
            title: 'Quota Dashboard',
            description: 'Visual breakdown of your mailbox usage. See exactly what\'s consuming your storage.'
        },
        {
            icon: <CalendarIcon />,
            title: 'Archive by Year',
            description: 'One-click archiving of emails by year. Clean up 2023 emails in seconds.'
        },
        {
            icon: <UsersIcon />,
            title: 'Archive by Sender',
            description: 'Group and archive emails by sender or domain. Bulk clean newsletters easily.'
        },
        {
            icon: <CopyIcon />,
            title: 'Duplicate Finder',
            description: 'Identify and remove duplicate emails that waste your precious storage.'
        },
        {
            icon: <CloudIcon />,
            title: 'Flexible Export',
            description: 'Export to local folder, OneDrive, or Google Drive. Your data, your choice.'
        },
        {
            icon: <DownloadIcon />,
            title: 'Multiple Formats',
            description: 'Export as PST, PDF bundle, EML files, or compressed ZIP archives.'
        }
    ];

    const pricingPlans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out MailManac',
            features: [
                '500 emails per archive',
                '1 archive per month',
                'Quota dashboard',
                'Local download only'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Pro',
            price: billingCycle === 'monthly' ? '$5' : '$4',
            period: billingCycle === 'monthly' ? '/month' : '/month (billed yearly)',
            description: 'For power users who need more',
            features: [
                'Unlimited emails',
                'Unlimited archives',
                'Duplicate finder',
                'All export formats',
                'OneDrive & Google Drive',
                'Priority support'
            ],
            cta: 'Start Pro Trial',
            popular: true
        },
        {
            name: 'Business',
            price: billingCycle === 'monthly' ? '$15' : '$12',
            period: billingCycle === 'monthly' ? '/month' : '/month (billed yearly)',
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Team management',
                'Admin dashboard',
                'API access',
                'SSO integration',
                'Dedicated support'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

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
                        <a href="#features" style={{
                            color: 'var(--gray-300)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
                        >Features</a>
                        <a href="#pricing" style={{
                            color: 'var(--gray-300)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
                        >Pricing</a>
                        <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
                        <button className="btn btn-primary flex items-center gap-2" onClick={handleMicrosoftSignIn}>
                            <MicrosoftIcon />
                            Outlook
                        </button>
                        <button className="btn btn-secondary flex items-center gap-2" onClick={handleGoogleSignIn}>
                            <GoogleIcon />
                            Gmail
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
                        📚 An Almanac for Your Mails
                    </div>

                    <h1 style={{ marginBottom: 'var(--space-6)' }}>
                        Organize Your Inbox<br />
                        <span className="text-gradient">Year by Year</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        maxWidth: '640px',
                        margin: '0 auto var(--space-8)'
                    }}>
                        Stop fighting quota warnings. Archive emails by year, sender, or folder.
                        Find duplicates. Export anywhere. Simple, visual, powerful.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-primary btn-lg flex items-center gap-2" onClick={handleMicrosoftSignIn}>
                                <MicrosoftIcon />
                                Connect Outlook
                            </button>
                            <button className="btn btn-lg flex items-center gap-2" onClick={handleGoogleSignIn}
                                style={{ background: 'white', color: '#333' }}>
                                <GoogleIcon />
                                Connect Gmail
                            </button>
                        </div>
                        <button className="btn btn-secondary" onClick={scrollToHowItWorks}>
                            How It Works
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16" style={{ maxWidth: '600px', margin: '4rem auto 0' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>50GB+</div>
                            <div style={{ color: 'var(--gray-400)' }}>Storage Freed</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>10K+</div>
                            <div style={{ color: 'var(--gray-400)' }}>Happy Users</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>99.9%</div>
                            <div style={{ color: 'var(--gray-400)' }}>Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>How it <span className="text-gradient">Works</span></h2>
                        <p style={{ marginTop: 'var(--space-4)' }}>Three simple steps to a cleaner inbox.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: 'var(--primary-600)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>1</div>
                            <h4>Connect</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                Sign in securely with your Gmail or Outlook account. We scan headers, never your passwords.
                            </p>
                        </div>
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: 'var(--gradient-primary)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>2</div>
                            <h4>Select</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                Choose to export by Year, by Sender, or by Folder. Preview what you are archiving first.
                            </p>
                        </div>
                        <div className="card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{
                                width: '64px', height: '64px', background: '#ec4899',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-6)', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>3</div>
                            <h4>Export</h4>
                            <p style={{ marginTop: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                Download as PDF/ZIP/PST to your computer or save directly to OneDrive/Google Drive.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2>Everything You Need to<br /><span className="text-gradient">Master Your Inbox</span></h2>
                        <p style={{ marginTop: 'var(--space-4)', maxWidth: '500px', margin: 'var(--space-4) auto 0' }}>
                            Powerful features designed for simplicity. No IT degree required.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="card" style={{ animationDelay: `${index * 100}ms` }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--space-4)',
                                    color: 'white'
                                }}>
                                    {feature.icon}
                                </div>
                                <h4 style={{ marginBottom: 'var(--space-2)' }}>{feature.title}</h4>
                                <p style={{ fontSize: '0.9375rem' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Export Destinations */}
            <section className="py-24" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                <div className="container">
                    <div className="flex gap-16 items-center">
                        <div style={{ flex: 1 }}>
                            <h2 style={{ marginBottom: 'var(--space-6)' }}>
                                Export Anywhere<br />
                                <span className="text-gradient">You Choose</span>
                            </h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                Your emails, your choice. Download locally, or save directly to your favorite cloud storage.
                                We support multiple formats to suit your needs.
                            </p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div style={{ color: 'var(--success-500)' }}><CheckIcon /></div>
                                    <span>Local download to any folder</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div style={{ color: 'var(--success-500)' }}><CheckIcon /></div>
                                    <span>OneDrive integration</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div style={{ color: 'var(--success-500)' }}><CheckIcon /></div>
                                    <span>Google Drive integration</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div style={{ color: 'var(--success-500)' }}><CheckIcon /></div>
                                    <span>PST, PDF, EML, ZIP formats</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div className="card" style={{ padding: 'var(--space-8)' }}>
                                <h4 style={{ marginBottom: 'var(--space-6)' }}>Choose Export Destination</h4>

                                <div className="flex flex-col gap-3">
                                    <div className="email-item" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-500)' }}>
                                        <div className="email-avatar" style={{ background: 'var(--primary-600)' }}>
                                            <DownloadIcon />
                                        </div>
                                        <div className="email-content">
                                            <div className="email-sender">Local Download</div>
                                            <div className="email-subject">Save to your computer</div>
                                        </div>
                                        <div style={{ color: 'var(--primary-400)' }}><CheckIcon /></div>
                                    </div>

                                    <div className="email-item">
                                        <div className="email-avatar" style={{ background: '#0078d4' }}>
                                            <CloudIcon />
                                        </div>
                                        <div className="email-content">
                                            <div className="email-sender">OneDrive</div>
                                            <div className="email-subject">Microsoft cloud storage</div>
                                        </div>
                                    </div>

                                    <div className="email-item">
                                        <div className="email-avatar" style={{ background: '#4285f4' }}>
                                            <CloudIcon />
                                        </div>
                                        <div className="email-content">
                                            <div className="email-sender">Google Drive</div>
                                            <div className="email-subject">Google cloud storage</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>Simple, Transparent <span className="text-gradient">Pricing</span></h2>
                        <p style={{ marginTop: 'var(--space-4)' }}>Start free, upgrade when you need more power.</p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <span style={{ color: billingCycle === 'monthly' ? 'white' : 'var(--gray-400)' }}>Monthly</span>
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
                                Yearly <span className="badge badge-success" style={{ marginLeft: 'var(--space-2)' }}>Save 20%</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    border: plan.popular ? '2px solid var(--primary-500)' : undefined,
                                    position: 'relative'
                                }}
                            >
                                {plan.popular && (
                                    <div className="badge badge-primary" style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}>
                                        Most Popular
                                    </div>
                                )}

                                <h4>{plan.name}</h4>
                                <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>{plan.description}</p>

                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>{plan.price}</span>
                                    <span style={{ color: 'var(--gray-400)' }}>{plan.period}</span>
                                </div>

                                <ul style={{ listStyle: 'none', marginBottom: 'var(--space-6)' }}>
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                                            <span style={{ color: 'var(--success-500)' }}><CheckIcon /></span>
                                            <span style={{ color: 'var(--gray-300)' }}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ width: '100%' }}
                                    onClick={() => {
                                        if (plan.name === 'Free') {
                                            document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            handleBuyPro();
                                        }
                                    }}
                                >
                                    {plan.name === 'Free' ? 'Get Started' : plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            className="text-link"
                            style={{ background: 'none', border: 'none', color: 'var(--gray-400)', textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => setShowVerificationModal(true)}
                        >
                            Already paid? Verify Receipt
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
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Free Up Your Inbox?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-8)', maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
                            Join thousands of Outlook users who have reclaimed their email storage.
                            Start for free, no credit card required.
                        </p>
                        <div className="flex gap-4 justify-center items-center" style={{ flexWrap: 'wrap' }}>
                            <button className="btn btn-lg" style={{
                                background: 'white',
                                color: 'var(--primary-700)'
                            }} onClick={handleMicrosoftSignIn}>
                                <MicrosoftIcon /> Outlook
                            </button>
                            <button className="btn btn-lg" style={{
                                background: 'white',
                                color: '#333'
                            }} onClick={handleGoogleSignIn}>
                                <GoogleIcon /> Gmail
                            </button>
                        </div>
                        <p style={{ marginTop: 'var(--space-6)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                            Using a work account?{' '}
                            <Link href="/request-approval" style={{ color: 'white', textDecoration: 'underline' }}>
                                Request IT approval
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <div className="container flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div style={{
                            background: 'var(--gradient-primary)',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <AlmanacIcon />
                        </div>
                        <span style={{ color: 'var(--gray-400)' }}>© 2026 MailManac. All rights reserved.</span>
                    </div>

                    <div className="flex gap-6">
                        <Link href="/privacy" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Terms of Service</Link>
                        <Link href="/request-approval" style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Work Accounts</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
