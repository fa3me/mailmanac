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
    // Fetch all labels with their message counts in one request
    const response = await fetch(
        `${GMAIL_API_BASE}/users/me/labels`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gmail API Error:', response.status, errorText);
        throw new Error(`Gmail API error: ${response.status}`);
    }

    const data = await response.json();
    const systemLabels = ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'STARRED', 'IMPORTANT'];

    // Fetch counts for each important label in parallel
    const labelIds = (data.labels || [])
        .filter(label => systemLabels.includes(label.id) || label.type === 'user')
        .slice(0, 15);

    const labelPromises = labelIds.map(label =>
        fetch(`${GMAIL_API_BASE}/users/me/labels/${label.id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(r => r.ok ? r.json() : { id: label.id, name: label.name, messagesTotal: 0 })
    );

    const labelDetails = await Promise.all(labelPromises);

    const folders = labelDetails.map(label => ({
        id: label.id,
        name: label.name || label.id,
        count: label.messagesTotal || 0,
        size: '0',
    })).filter(f => f.count > 0 || systemLabels.includes(f.id));

    return Response.json({ folders });
}
