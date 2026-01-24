import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Get Gmail profile for total message count
        const profileResponse = await fetch(
            `${GMAIL_API_BASE}/users/me/profile`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        let totalEmails = 0;
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            totalEmails = profileData.messagesTotal || 0;
        }

        // Get storage quota from Drive API (Gmail uses Drive storage)
        let storageUsed = 0;
        let storageTotal = 15; // Default 15GB for free accounts
        let usagePercentage = 0;

        try {
            const storageResponse = await fetch(
                `${DRIVE_API_BASE}/about?fields=storageQuota`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (storageResponse.ok) {
                const storageData = await storageResponse.json();
                const quota = storageData.storageQuota;
                if (quota) {
                    // Convert bytes to GB
                    storageUsed = (parseInt(quota.usage || 0) / (1024 * 1024 * 1024)).toFixed(2);
                    storageTotal = Math.round(parseInt(quota.limit || 15 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024));
                    usagePercentage = ((storageUsed / storageTotal) * 100).toFixed(1);
                }
            }
        } catch (err) {
            console.error('Error fetching storage:', err);
        }

        // Get recent messages for sender analysis (limited for performance)
        const listResponse = await fetch(
            `${GMAIL_API_BASE}/users/me/messages?maxResults=100`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        const senderMap = {};
        if (listResponse.ok) {
            const listData = await listResponse.json();
            const messageIds = listData.messages || [];

            // Fetch details for top senders (batch for performance)
            for (const msg of messageIds.slice(0, 50)) {
                try {
                    const msgResponse = await fetch(
                        `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.accessToken}`,
                            },
                        }
                    );

                    if (msgResponse.ok) {
                        const msgData = await msgResponse.json();
                        const fromHeader = msgData.payload?.headers?.find(h => h.name === 'From')?.value || 'unknown';

                        const emailMatch = fromHeader.match(/<(.+?)>/) || [null, fromHeader];
                        const senderEmail = emailMatch[1]?.toLowerCase() || fromHeader.toLowerCase();
                        const senderName = fromHeader.replace(/<.+?>/, '').trim() || senderEmail;

                        if (!senderMap[senderEmail]) {
                            senderMap[senderEmail] = { email: senderEmail, name: senderName, count: 0 };
                        }
                        senderMap[senderEmail].count++;
                    }
                } catch (err) {
                    // Skip failed messages
                }
            }
        }

        const topSenders = Object.values(senderMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Get labels (folders)
        let labels = [];
        try {
            const labelsResponse = await fetch(
                `${GMAIL_API_BASE}/users/me/labels`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (labelsResponse.ok) {
                const labelsData = await labelsResponse.json();
                const systemLabels = ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'STARRED'];
                labels = (labelsData.labels || [])
                    .filter(l => systemLabels.includes(l.id) || l.type === 'user')
                    .slice(0, 10)
                    .map(l => ({
                        name: l.name || l.id,
                        count: l.messagesTotal || 0,
                        size: '0',
                    }));
            }
        } catch (err) {
            console.error('Error fetching labels:', err);
        }

        return Response.json({
            stats: {
                totalEmails,
                storageUsed,
                storageTotal,
                usagePercentage,
                inboxCount: totalEmails,
            },
            folders: labels,
            topSenders,
        });
    } catch (error) {
        console.error('Gmail Mail API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
