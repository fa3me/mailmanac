// Microsoft Graph API helper functions

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

/**
 * Fetch user profile from Microsoft Graph
 */
export async function getUserProfile(accessToken) {
    const response = await fetch(`${GRAPH_API_BASE}/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    return response.json();
}

/**
 * Get mailbox usage/quota information
 */
export async function getMailboxUsage(accessToken) {
    // Get mailbox settings and folder stats
    const foldersResponse = await fetch(
        `${GRAPH_API_BASE}/me/mailFolders?$top=50`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!foldersResponse.ok) {
        throw new Error('Failed to fetch mail folders');
    }

    const folders = await foldersResponse.json();
    return folders;
}

/**
 * Get email count and stats by folder
 */
export async function getMailStats(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/mailFolders?$select=displayName,totalItemCount,unreadItemCount,sizeInBytes`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch mail stats');
    }

    const data = await response.json();
    return data.value;
}

/**
 * Get emails grouped by sender
 */
export async function getEmailsBySender(accessToken, top = 100) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=from,receivedDateTime,hasAttachments,subject&$top=${top}&$orderby=receivedDateTime desc`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch emails');
    }

    const data = await response.json();

    // Group by sender
    const senderMap = {};
    data.value.forEach((email) => {
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

    // Convert to array and sort by count
    return Object.values(senderMap).sort((a, b) => b.count - a.count);
}

/**
 * Get emails by year
 */
export async function getEmailsByYear(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=receivedDateTime&$top=500&$orderby=receivedDateTime desc`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch emails by year');
    }

    const data = await response.json();

    // Group by year
    const yearMap = {};
    data.value.forEach((email) => {
        const year = new Date(email.receivedDateTime).getFullYear();
        if (!yearMap[year]) {
            yearMap[year] = { year, count: 0 };
        }
        yearMap[year].count++;
    });

    return Object.values(yearMap).sort((a, b) => b.year - a.year);
}

/**
 * Get total email count
 */
export async function getTotalEmailCount(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/mailFolders/inbox?$select=totalItemCount`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch inbox count');
    }

    const data = await response.json();
    return data.totalItemCount;
}

/**
 * Search for duplicate emails (by subject)
 */
export async function findDuplicateEmails(accessToken, top = 200) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=subject,from,receivedDateTime&$top=${top}&$orderby=subject`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to search for duplicates');
    }

    const data = await response.json();

    // Find duplicates by subject
    const subjectMap = {};
    data.value.forEach((email) => {
        const subject = email.subject?.toLowerCase().trim() || '';
        if (!subjectMap[subject]) {
            subjectMap[subject] = [];
        }
        subjectMap[subject].push(email);
    });

    // Filter to only duplicates (more than 1 email with same subject)
    const duplicates = Object.entries(subjectMap)
        .filter(([_, emails]) => emails.length > 1)
        .map(([subject, emails]) => ({
            subject: emails[0].subject,
            count: emails.length,
            emails: emails,
        }))
        .sort((a, b) => b.count - a.count);

    return duplicates;
}
