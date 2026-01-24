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
            return await getGmailByYear(session.accessToken);
        } else {
            return await getOutlookByYear(session.accessToken);
        }
    } catch (error) {
        console.error('By Year API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

async function getOutlookByYear(accessToken) {
    const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?$select=receivedDateTime&$top=500&$orderby=receivedDateTime desc`,
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
    return processYears(data.value || []);
}

async function getGmailByYear(accessToken) {
    const currentYear = new Date().getFullYear();
    const cutoffYear = currentYear - 6; // Dynamic: 7 years back
    const years = [];

    // Get counts for last 7 years in parallel
    const yearPromises = [];
    for (let year = currentYear; year >= cutoffYear; year--) {
        yearPromises.push(countEmailsForYear(accessToken, year));
    }

    // Also get "before cutoffYear" count
    yearPromises.push(countEmailsBeforeYear(accessToken, cutoffYear));

    const results = await Promise.all(yearPromises);

    // Add individual years
    results.slice(0, -1).forEach(result => {
        if (result && result.count > 0) {
            years.push(result);
        }
    });

    // Add "before X" bucket
    const beforeResult = results[results.length - 1];
    if (beforeResult && beforeResult.count > 0) {
        years.push({
            year: `Before ${cutoffYear}`,
            count: beforeResult.count,
            isBefore: true,
            beforeYear: cutoffYear
        });
    }

    return Response.json({
        years,
        totalFetched: years.reduce((sum, y) => sum + y.count, 0),
        cutoffYear
    });
}

async function countEmailsForYear(accessToken, year) {
    const query = `after:${year}/1/1 before:${year + 1}/1/1`;

    let count = 0;
    let pageToken = null;
    let iterations = 0;
    const maxIterations = 30;

    do {
        const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=500${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) break;

        const data = await response.json();
        count += (data.messages?.length || 0);
        pageToken = data.nextPageToken;
        iterations++;
    } while (pageToken && iterations < maxIterations);

    return { year, count };
}

async function countEmailsBeforeYear(accessToken, beforeYear) {
    const query = `before:${beforeYear}/1/1`;

    let count = 0;
    let pageToken = null;
    let iterations = 0;
    const maxIterations = 50; // Allow more iterations for older emails

    do {
        const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=500${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) break;

        const data = await response.json();
        count += (data.messages?.length || 0);
        pageToken = data.nextPageToken;
        iterations++;
    } while (pageToken && iterations < maxIterations);

    return { year: `Before ${beforeYear}`, count, isBefore: true };
}

function processYears(messages) {
    const currentYear = new Date().getFullYear();
    const cutoffYear = currentYear - 6;
    const yearMap = {};
    let beforeCount = 0;

    messages.forEach((email) => {
        try {
            const year = new Date(email.receivedDateTime).getFullYear();
            if (year && !isNaN(year)) {
                if (year < cutoffYear) {
                    beforeCount++;
                } else {
                    if (!yearMap[year]) {
                        yearMap[year] = { year, count: 0 };
                    }
                    yearMap[year].count++;
                }
            }
        } catch (e) {
            // Skip invalid dates
        }
    });

    const years = Object.values(yearMap).sort((a, b) => b.year - a.year);

    if (beforeCount > 0) {
        years.push({
            year: `Before ${cutoffYear}`,
            count: beforeCount,
            isBefore: true,
            beforeYear: cutoffYear
        });
    }

    return Response.json({ years, totalFetched: messages.length, cutoffYear });
}
