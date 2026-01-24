import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { filename, content, folderPath = 'MailManac Archives', senderFolder = '' } = body;

        if (!filename || !content) {
            return Response.json({ error: 'Filename and content required' }, { status: 400 });
        }

        // Build the full path - include sender folder for organization
        let fullPath = folderPath;
        if (senderFolder) {
            // Sanitize sender folder name
            const safeSenderFolder = senderFolder
                .replace(/[<>:"/\\|?*]/g, '_')
                .substring(0, 100);
            fullPath = `${folderPath}/${safeSenderFolder}`;
        }
        fullPath = `${fullPath}/${filename}`;

        // Upload file to OneDrive
        const uploadResponse = await fetch(
            `${GRAPH_API_BASE}/me/drive/root:/${encodeURIComponent(fullPath)}:/content`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'message/rfc822',
                },
                body: content,
            }
        );

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('OneDrive upload error:', uploadResponse.status, errorText);

            if (uploadResponse.status === 403) {
                return Response.json({
                    error: 'OneDrive permission not granted. Please sign out and sign in again.',
                    needsReauth: true
                }, { status: 403 });
            }

            throw new Error(`Upload failed: ${uploadResponse.status}`);
        }

        const result = await uploadResponse.json();

        return Response.json({
            success: true,
            file: {
                name: result.name,
                path: result.parentReference?.path?.replace('/drive/root:', '') + '/' + result.name,
                fullPath: fullPath,
                webUrl: result.webUrl,
                size: result.size,
            },
        });
    } catch (error) {
        console.error('OneDrive API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
