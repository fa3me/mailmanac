import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export const dynamic = 'force-dynamic';

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
            return await getGmailLabels(session.accessToken);
        } else {
            return await getOutlookFolders(session.accessToken);
        }
    } catch (error) {
        console.error('By Folder API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function getOutlookFolders(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/mailFolders?$select=id,displayName,totalItemCount`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Graph API Error:', response.status, errorText);
        throw new Error(`Graph API error: ${response.status}`);
    }

    const data = await response.json();
    const folders = (data.value || []).map(folder => ({
        id: folder.id,
        name: folder.displayName,
        count: folder.totalItemCount || 0,
        size: '0',
    }));

    return Response.json({ folders });
}

async function getGmailLabels(accessToken) {
    try {
        // Fetch all labels
        const response = await fetch(
            `${GMAIL_API_BASE}/users/me/labels`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!response.ok) {
            console.error('Gmail Labels API Error:', response.status);
            // Fallback: return empty folders instead of throwing, so UI shows specific error message or empty state
            // But better: Return a mock INBOX if everything fails so user sees something? 
            // actually, let's throw but handle it in the main GET to return safe empty array
            throw new Error(`Gmail API error: ${response.status}`);
        }

        const data = await response.json();
        const systemLabels = ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'STARRED'];

        // Prioritize system labels and user labels
        const allLabels = (data.labels || [])
            .filter(label => systemLabels.includes(label.id) || label.type === 'user');

        // Process in small batches
        const BATCH_SIZE = 5; // Reduced to be safer
        const results = [];

        for (let i = 0; i < allLabels.length; i += BATCH_SIZE) {
            const batch = allLabels.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(batch.map(async (label) => {
                try {
                    const res = await fetch(`${GMAIL_API_BASE}/users/me/labels/${label.id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    if (res.ok) return await res.json();
                    return { ...label, messagesTotal: 0 };
                } catch (err) {
                    return { ...label, messagesTotal: 0 };
                }
            }));
            results.push(...batchResults);
            // Tiny delay to be nice to API
            await new Promise(r => setTimeout(r, 100));
        }

        const folders = results.map(label => ({
            id: label.id,
            name: label.name || label.id,
            count: label.messagesTotal || 0,
            size: '0',
        })).filter(f => f.count > 0 || systemLabels.includes(f.id));

        return Response.json({ folders });

    } catch (error) {
        console.error('Critical Gmail Folder Error:', error);
        // Fail gracefully: Return empty list instead of 500
        return Response.json({ folders: [] });
    }
}
