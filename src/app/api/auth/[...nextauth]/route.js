import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        // Microsoft / Outlook
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID || process.env.MICROSOFT_TENANT_ID,
            authorization: {
                params: {
                    scope: 'openid profile email User.Read Mail.Read Mail.ReadWrite Files.ReadWrite offline_access',
                },
            },
        }),
        // Google / Gmail
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/drive.file',
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the access token and provider to the JWT
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                token.provider = account.provider; // 'azure-ad' or 'google'
            }
            return token;
        },
        async session({ session, token }) {
            // Make access token and provider available in session
            session.accessToken = token.accessToken;
            session.provider = token.provider;
            return session;
        },
    },
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
