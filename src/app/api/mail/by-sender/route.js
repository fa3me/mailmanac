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

        // Detect provider
        const isGmail = session.provider === 'google' ||
            session.user?.email?.includes('@gmail.com') ||
            session.user?.email?.includes('@googlemail.com');

        if (isGmail) {
            return await getGmailSenders(session.accessToken);
        } else {
            return await getOutlookSenders(session.accessToken);
        }
    } catch (error) {
        console.error('By Sender API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function getOutlookSenders(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=from,receivedDateTime&$top=500&$orderby=receivedDateTime desc`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Graph API error: ${response.status}`);
    }

    const data = await response.json();
    return processSenders(data.value || []);
}

async function getGmailSenders(accessToken) {
    // Step 1: Get a larger sample to identify unique senders
    let allMessageIds = [];
    let pageToken = null;

    // Get up to 1000 message IDs to find senders
    for (let i = 0; i < 2; i++) {
        const url = `${GMAIL_API_BASE}/users/me/messages?maxResults=500${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (!response.ok) break;
        const data = await response.json();
        allMessageIds = [...allMessageIds, ...(data.messages || [])];
        pageToken = data.nextPageToken;
        if (!pageToken) break;
    }

    // Fetch From headers in parallel batches
    const senderEmails = new Set();
    const senderNames = {};

    const batchSize = 50;
    for (let i = 0; i < Math.min(allMessageIds.length, 200); i += batchSize) {
        const batch = allMessageIds.slice(i, i + batchSize);
        const headerPromises = batch.map(msg =>
            fetch(
                `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            ).then(r => r.ok ? r.json() : null).catch(() => null)
        );

        const messagesData = await Promise.all(headerPromises);

        messagesData.filter(m => m !== null).forEach(msgData => {
            const fromHeader = msgData.payload?.headers?.find(h => h.name === 'From')?.value || '';
            const emailMatch = fromHeader.match(/<(.+?)>/) || [null, fromHeader];
            const senderEmail = (emailMatch[1] || fromHeader).toLowerCase().trim();
            const senderName = fromHeader.replace(/<.+?>/, '').replace(/"/g, '').trim() || senderEmail;

            if (senderEmail && senderEmail.includes('@')) {
                senderEmails.add(senderEmail);
                if (!senderNames[senderEmail]) {
                    senderNames[senderEmail] = senderName;
                }
            }
        });
    }

    // Step 2: Get ACCURATE count for each sender using pagination (not resultSizeEstimate)
    // Limit to top 15 candidates to get accurate counts
    const candidates = Array.from(senderEmails).slice(0, 15);

    const senderCountPromises = candidates.map(async (email) => {
        try {
            const query = `from:${email}`;
            let count = 0;
            let pageToken = null;
            let iterations = 0;
            const maxIterations = 20;

            // Paginate to get accurate count
            do {
                const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=500${pageToken ? `&pageToken=${pageToken}` : ''}`;
                const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });

                if (!response.ok) break;

                const data = await response.json();
                count += (data.messages?.length || 0);
                pageToken = data.nextPageToken;
                iterations++;
            } while (pageToken && iterations < maxIterations);

            return {
                email,
                name: senderNames[email] || email,
                count
            };
        } catch (err) {
            console.error(`Error counting ${email}:`, err);
            return { email, name: senderNames[email] || email, count: 0 };
        }
    });

    const senderCounts = await Promise.all(senderCountPromises);

    // Sort by count and take top 10
    const senders = senderCounts
        .filter(s => s.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return Response.json({ senders });
}

function processSenders(messages) {
    const senderMap = {};

    messages.forEach(msg => {
        const email = msg.from?.emailAddress?.address?.toLowerCase() || 'unknown';
        const name = msg.from?.emailAddress?.name || email;

        if (!senderMap[email]) {
            senderMap[email] = { email, name, count: 0 };
        }
        senderMap[email].count++;
    });

    // Only return top 10
    const senders = Object.values(senderMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return Response.json({ senders });
}
