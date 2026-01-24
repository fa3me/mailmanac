import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sender = searchParams.get('sender');

        if (!sender) {
            return Response.json({ error: 'Sender email required' }, { status: 400 });
        }

        // Detect provider
        const isGmail = session.provider === 'google' ||
            session.user?.email?.includes('@gmail.com') ||
            session.user?.email?.includes('@googlemail.com');

        if (isGmail) {
            return await getGmailPreview(session.accessToken, sender);
        } else {
            return await getOutlookPreview(session.accessToken, sender);
        }
    } catch (error) {
        console.error('Emails Preview API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function getOutlookPreview(accessToken, sender) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=id,subject,receivedDateTime,bodyPreview,hasAttachments,from&$top=200&$orderby=receivedDateTime desc`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Graph API Error:', response.status, errorText);
        throw new Error('Failed to fetch emails');
    }

    const data = await response.json();

    // Filter by sender email client-side
    const allEmails = data.value || [];
    const filteredEmails = allEmails.filter(email => {
        const emailSender = email.from?.emailAddress?.address?.toLowerCase() || '';
        return emailSender === sender.toLowerCase();
    });

    const emails = filteredEmails.map(email => ({
        id: email.id,
        subject: email.subject || '(No subject)',
        date: email.receivedDateTime,
        preview: email.bodyPreview?.substring(0, 150) || '',
        hasAttachments: email.hasAttachments || false,
    }));

    return Response.json({ emails, count: emails.length });
}

async function getGmailPreview(accessToken, sender) {
    // Search for emails from this sender
    const query = `from:${sender}`;
    const listResponse = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!listResponse.ok) {
        throw new Error('Failed to fetch emails');
    }

    const listData = await listResponse.json();
    const messageIds = listData.messages || [];

    // Fetch message details in parallel
    const messagePromises = messageIds.map(msg =>
        fetch(
            `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=minimal`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        ).then(r => r.ok ? r.json() : null).catch(() => null)
    );

    const messagesData = await Promise.all(messagePromises);

    const emails = messagesData
        .filter(m => m !== null)
        .map(msg => {
            const headers = msg.payload?.headers || [];
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)';
            const date = headers.find(h => h.name === 'Date')?.value;

            return {
                id: msg.id,
                subject,
                date,
                preview: msg.snippet?.substring(0, 150) || '',
                hasAttachments: (msg.labelIds || []).includes('ATTACHMENT') || false,
            };
        });

    return Response.json({ emails, count: emails.length });
}
