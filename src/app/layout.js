import { LanguageProvider } from './context/LanguageContext';
import './globals.css';
import AuthProvider from './components/AuthProvider';

export const metadata = {
    title: 'MailManac - Fix Mailbox Full | Free Email Archiving Tool',
    description: 'Mailbox full? Fix Gmail and Outlook storage issues instantly. Free email archiving tool to clean up your inbox by year, sender, or folder. Stop quota warnings forever.',
    keywords: 'mailbox full, inbox full, email storage full, Gmail quota exceeded, Outlook mailbox full, fix email storage, email archiving, clean up inbox, free up email space, email quota management, archive old emails, delete old emails safely',
    metadataBase: new URL('https://mailmanac.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Fix Mailbox Full - Free Email Archiving Tool | MailManac',
        description: 'Mailbox full? MailManac helps you archive and organize emails by year, sender, or folder. Works with Gmail and Outlook. 100% Free.',
        url: 'https://mailmanac.com',
        siteName: 'MailManac',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'MailManac - Fix Mailbox Full Issues',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mailbox Full? Fix It Free with MailManac',
        description: 'Archive emails by year, sender, or folder. Free up Gmail/Outlook space instantly. No payment required.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    verification: {
        google: '2oaKofmhvhSFYrEGGHC92g4TSg_0aw9AoQgckRRBZrk',
    },
};

// Structured Data for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MailManac',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    description: 'Free email archiving tool to fix mailbox full issues. Archive emails by year, sender, or folder for Gmail and Outlook.',
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="google-site-verification" content="2oaKofmhvhSFYrEGGHC92g4TSg_0aw9AoQgckRRBZrk" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <AuthProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
