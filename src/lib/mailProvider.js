// Provider-agnostic mail utilities
// Detects which email provider is being used and returns the appropriate API URL

export function getMailProvider(session) {
    if (!session?.provider) {
        // Try to detect from email domain as fallback
        const email = session?.user?.email || '';
        if (email.includes('@gmail.com') || email.includes('@googlemail.com')) {
            return 'google';
        }
        return 'microsoft';
    }

    return session.provider === 'google' ? 'google' : 'microsoft';
}

export function getProviderName(session) {
    const provider = getMailProvider(session);
    return provider === 'google' ? 'Gmail' : 'Outlook';
}

export function getProviderIcon(session) {
    const provider = getMailProvider(session);
    return provider === 'google' ? '📧' : '📬';
}
