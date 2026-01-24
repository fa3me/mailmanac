import { LanguageProvider } from './context/LanguageContext';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';

export const metadata = {
    title: 'MailManac - Email Archiving Simplified',
    description: 'Organize your inbox by year, sender, or folder.',
    keywords: 'email archiving, Gmail, Outlook, quota management, email organization, email cleanup',
    metadataBase: new URL('https://mailmanac.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'MailManac - An Almanac for Your Mails',
        description: 'Stop fighting quota warnings. Archive emails by year, sender, or folder. Visual, simple, and secure.',
        url: 'https://mailmanac.com',
        siteName: 'MailManac',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MailManac - An Almanac for Your Mails',
        description: 'Stop fighting quota warnings. Archive emails by year, sender, or folder.',
    },
    verification: {
        google: '2oaKofmhvhSFYrEGGHC92g4TSg_0aw9AoQgckRRBZrk',
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
            </head>
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
