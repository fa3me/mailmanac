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

        const isGoogle = session.provider === 'google';
        let messages = [];

        if (isGoogle) {
            messages = await fetchGmailMessages(session.accessToken);
        } else {
            messages = await fetchOutlookMessages(session.accessToken);
        }

        // Find duplicates by subject + sender + approximate time
        const duplicateGroups = findDuplicates(messages);

        return Response.json({
            duplicateGroups,
            totalDuplicates: duplicateGroups.reduce((sum, g) => sum + g.count - 1, 0),
            potentialSavings: duplicateGroups.reduce((sum, g) => sum + (g.count - 1) * g.avgSize, 0),
        });
    } catch (error) {
        console.error('Duplicates API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function fetchOutlookMessages(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=id,subject,from,receivedDateTime,conversationId&$top=200&$orderby=receivedDateTime desc`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!response.ok) throw new Error('Failed to fetch Outlook messages');

    const data = await response.json();
    return (data.value || []).map(msg => ({
        id: msg.id,
        subject: msg.subject || '',
        sender: msg.from?.emailAddress?.address || '',
        date: msg.receivedDateTime,
        conversationId: msg.conversationId,
        size: 5000, // Estimate
    }));
}

async function fetchGmailMessages(accessToken) {
    // Get message list
    const listResponse = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?maxResults=200`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!listResponse.ok) throw new Error('Failed to fetch Gmail messages');

    const listData = await listResponse.json();
    const messageIds = listData.messages || [];

    const messages = [];

    // Fetch details for each (limited batch)
    for (const msg of messageIds.slice(0, 100)) {
        try {
            const msgResponse = await fetch(
                `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            if (msgResponse.ok) {
                const msgData = await msgResponse.json();
                const headers = msgData.payload?.headers || [];

                messages.push({
                    id: msg.id,
                    subject: headers.find(h => h.name === 'Subject')?.value || '',
                    sender: headers.find(h => h.name === 'From')?.value || '',
                    date: headers.find(h => h.name === 'Date')?.value,
                    threadId: msgData.threadId,
                    size: msgData.sizeEstimate || 5000,
                });
            }
        } catch (err) {
            // Skip failed messages
        }
    }

    return messages;
}

function findDuplicates(messages) {
    // Group by normalized subject (without Re:/Fwd: prefixes)
    const groups = {};

    messages.forEach(msg => {
        const normalizedSubject = normalizeSubject(msg.subject);
        const key = `${normalizedSubject}::${msg.sender.toLowerCase()}`;

        if (!groups[key]) {
            groups[key] = {
                subject: msg.subject,
                sender: msg.sender,
                messages: [],
                count: 0,
                avgSize: 0,
            };
        }
        groups[key].messages.push(msg);
        groups[key].count++;
    });

    // Filter to only groups with duplicates
    const duplicates = Object.values(groups)
        .filter(g => g.count > 1)
        .map(g => ({
            ...g,
            avgSize: g.messages.reduce((sum, m) => sum + (m.size || 5000), 0) / g.count,
            messages: g.messages.slice(0, 10), // Limit for response size
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 duplicate groups

    return duplicates;
}

function normalizeSubject(subject) {
    // Remove Re:, Fwd:, Fw: prefixes and normalize whitespace
    return (subject || '')
        .replace(/^(re|fwd|fw):\s*/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}
