import './globals.css';
import AuthProvider from './components/AuthProvider';

export const metadata = {
    title: 'MailManac - An Almanac for Your Mails',
    description: 'Organize your inbox year by year. Archive emails by year, sender, or folder. Works with Gmail and Outlook.',
    keywords: 'email archiving, Gmail, Outlook, quota management, email organization, email cleanup',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
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
