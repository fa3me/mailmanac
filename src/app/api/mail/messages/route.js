import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sender = searchParams.get('sender');
        const year = searchParams.get('year');
        const folder = searchParams.get('folder');
        const beforeYear = searchParams.get('beforeYear'); // For "Before 2020" type queries

        // Detect provider
        const isGmail = session.provider === 'google' ||
            session.user?.email?.includes('@gmail.com') ||
            session.user?.email?.includes('@googlemail.com');

        if (isGmail) {
            return await getGmailMessages(session.accessToken, { sender, year, folder, beforeYear });
        } else {
            return await getOutlookMessages(session.accessToken, { sender, year, folder });
        }
    } catch (error) {
        console.error('Messages API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function getOutlookMessages(accessToken, { sender, year, folder }) {
    let filter = '';

    if (sender) {
        filter = `from/emailAddress/address eq '${sender}'`;
    } else if (year) {
        const startDate = `${year}-01-01T00:00:00Z`;
        const endDate = `${year}-12-31T23:59:59Z`;
        filter = `receivedDateTime ge ${startDate} and receivedDateTime le ${endDate}`;
    }

    let url = `${GRAPH_API_BASE}/me/messages?$select=id,subject,receivedDateTime&$top=100`;

    if (folder) {
        url = `${GRAPH_API_BASE}/me/mailFolders/${folder}/messages?$select=id,subject,receivedDateTime&$top=100`;
    }

    if (filter) {
        url += `&$filter=${encodeURIComponent(filter)}`;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Graph API Error:', response.status, errorText);
        throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    const messages = (data.value || []).map(m => ({
        id: m.id,
        subject: m.subject,
        date: m.receivedDateTime,
    }));

    return Response.json({ messages, count: messages.length });
}

async function getGmailMessages(accessToken, { sender, year, folder, beforeYear }) {
    let query = '';

    if (sender) {
        query = `from:${sender}`;
    } else if (year) {
        // Check if it's a "Before X" query
        if (typeof year === 'string' && year.startsWith('Before ')) {
            const cutoffYear = parseInt(year.replace('Before ', ''));
            query = `before:${cutoffYear}/1/1`;
        } else {
            query = `after:${year}/1/1 before:${parseInt(year) + 1}/1/1`;
        }
    } else if (beforeYear) {
        query = `before:${beforeYear}/1/1`;
    } else if (folder) {
        // Gmail uses labels instead of folders
        query = `label:${folder}`;
    }

    // Paginate to get all messages
    let allMessages = [];
    let pageToken = null;
    let iterations = 0;
    const maxIterations = 20;

    do {
        const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=500${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) break;

        const data = await response.json();

        // For each message, we just need the ID
        const msgIds = (data.messages || []).map(m => ({
            id: m.id,
            subject: '', // Will be fetched during export if needed
            date: '',
        }));

        allMessages = [...allMessages, ...msgIds];
        pageToken = data.nextPageToken;
        iterations++;
    } while (pageToken && iterations < maxIterations);

    return Response.json({ messages: allMessages, count: allMessages.length });
}
