import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { messageIds, deleteAfterExport = false } = body;

        if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
            return Response.json({ error: 'No message IDs provided' }, { status: 400 });
        }

        // Detect provider
        const isGmail = session.provider === 'google' ||
            session.user?.email?.includes('@gmail.com') ||
            session.user?.email?.includes('@googlemail.com');

        if (isGmail) {
            return await exportGmailMessages(session.accessToken, messageIds, deleteAfterExport);
        } else {
            return await exportOutlookMessages(session.accessToken, messageIds, deleteAfterExport);
        }
    } catch (error) {
        console.error('Export API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function exportOutlookMessages(accessToken, messageIds, deleteAfterExport) {
    const messages = [];
    const errors = [];

    for (const id of messageIds.slice(0, 50)) {
        try {
            const response = await fetch(
                `${GRAPH_API_BASE}/me/messages/${id}/$value`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (response.ok) {
                const emlContent = await response.text();

                const metaResponse = await fetch(
                    `${GRAPH_API_BASE}/me/messages/${id}?$select=subject,receivedDateTime`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                let filename = 'email';
                if (metaResponse.ok) {
                    const meta = await metaResponse.json();
                    const date = new Date(meta.receivedDateTime).toISOString().split('T')[0];
                    const subject = (meta.subject || 'no-subject')
                        .replace(/[^a-zA-Z0-9 ]/g, '')
                        .substring(0, 50)
                        .trim();
                    filename = `${date}_${subject}`;
                }

                messages.push({ id, filename: `${filename}.eml`, content: emlContent });
            } else {
                errors.push({ id, error: 'Failed to fetch' });
            }
        } catch (err) {
            errors.push({ id, error: err.message });
        }
    }

    let deleted = 0;
    if (deleteAfterExport && messages.length > 0) {
        for (const msg of messages) {
            try {
                const deleteResponse = await fetch(
                    `${GRAPH_API_BASE}/me/messages/${msg.id}`,
                    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
                );
                if (deleteResponse.ok) deleted++;
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    }

    return Response.json({
        success: true,
        exported: messages.length,
        deleted,
        errors: errors.length,
        files: messages.map(m => ({ filename: m.filename, content: m.content })),
    });
}

async function exportGmailMessages(accessToken, messageIds, deleteAfterExport) {
    const messages = [];
    const errors = [];

    // Process in batches for better performance
    for (const id of messageIds.slice(0, 50)) {
        try {
            // Get full message in raw format (RFC 2822)
            const response = await fetch(
                `${GMAIL_API_BASE}/users/me/messages/${id}?format=raw`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (response.ok) {
                const data = await response.json();
                // Decode base64url to get raw email content
                const rawContent = data.raw || '';
                const emlContent = atob(rawContent.replace(/-/g, '+').replace(/_/g, '/'));

                // Get subject from headers for filename
                const metaResponse = await fetch(
                    `${GMAIL_API_BASE}/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=Date`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                let filename = 'email';
                if (metaResponse.ok) {
                    const meta = await metaResponse.json();
                    const headers = meta.payload?.headers || [];
                    const subject = headers.find(h => h.name === 'Subject')?.value || 'no-subject';
                    const dateStr = headers.find(h => h.name === 'Date')?.value;

                    let date = new Date().toISOString().split('T')[0];
                    if (dateStr) {
                        try {
                            date = new Date(dateStr).toISOString().split('T')[0];
                        } catch (e) { }
                    }

                    const safeSubject = subject
                        .replace(/[^a-zA-Z0-9 ]/g, '')
                        .substring(0, 50)
                        .trim();
                    filename = `${date}_${safeSubject}`;
                }

                messages.push({ id, filename: `${filename}.eml`, content: emlContent });
            } else {
                errors.push({ id, error: 'Failed to fetch' });
            }
        } catch (err) {
            errors.push({ id, error: err.message });
        }
    }

    let deleted = 0;
    if (deleteAfterExport && messages.length > 0) {
        for (const msg of messages) {
            try {
                // Gmail: Move to trash
                const deleteResponse = await fetch(
                    `${GMAIL_API_BASE}/users/me/messages/${msg.id}/trash`,
                    { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }
                );
                if (deleteResponse.ok) deleted++;
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    }

    return Response.json({
        success: true,
        exported: messages.length,
        deleted,
        errors: errors.length,
        files: messages.map(m => ({ filename: m.filename, content: m.content })),
    });
}
