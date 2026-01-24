import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch mail folders - simpler query without sizeInBytes which isn't always available
        let mailFolders = [];
        try {
            const foldersResponse = await fetch(
                `${GRAPH_API_BASE}/me/mailFolders?$top=50`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (foldersResponse.ok) {
                const foldersData = await foldersResponse.json();
                mailFolders = foldersData.value || [];
            } else {
                console.error('Folders fetch failed:', await foldersResponse.text());
            }
        } catch (err) {
            console.error('Error fetching folders:', err);
        }

        // Fetch recent messages for sender analysis
        let topSenders = [];
        let messageCount = 0;
        try {
            const messagesResponse = await fetch(
                `${GRAPH_API_BASE}/me/messages?$select=from,receivedDateTime&$top=200&$orderby=receivedDateTime desc`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                const messages = messagesData.value || [];
                messageCount = messages.length;

                // Group by sender
                const senderMap = {};
                messages.forEach((email) => {
                    const senderEmail = email.from?.emailAddress?.address || 'unknown';
                    if (!senderMap[senderEmail]) {
                        senderMap[senderEmail] = {
                            email: senderEmail,
                            name: email.from?.emailAddress?.name || senderEmail,
                            count: 0,
                        };
                    }
                    senderMap[senderEmail].count++;
                });

                topSenders = Object.values(senderMap).sort((a, b) => b.count - a.count);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        }

        // Calculate totals from folders
        let totalEmails = 0;
        mailFolders.forEach((folder) => {
            totalEmails += folder.totalItemCount || 0;
        });

        // If folders didn't return counts, use message count as fallback
        if (totalEmails === 0 && messageCount > 0) {
            totalEmails = messageCount;
        }

        // Get inbox count specifically
        const inboxFolder = mailFolders.find(f =>
            f.displayName?.toLowerCase() === 'inbox' ||
            f.displayName?.toLowerCase() === 'boîte de réception' ||
            f.displayName?.toLowerCase() === 'gelen kutusu'
        );

        return Response.json({
            stats: {
                totalEmails,
                storageUsed: '0.00', // Not reliably available for personal accounts
                storageTotal: 15,
                usagePercentage: '0',
                inboxCount: inboxFolder?.totalItemCount || totalEmails,
            },
            folders: mailFolders.slice(0, 10).map((f) => ({
                name: f.displayName || 'Unknown',
                count: f.totalItemCount || 0,
                size: '0',
            })),
            topSenders: topSenders.slice(0, 10),
        });
    } catch (error) {
        console.error('Mail API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
