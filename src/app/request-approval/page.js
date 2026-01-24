'use client';

import { useSession } from 'next-auth/react';
import RequestAdminApproval from '../components/RequestAdminApproval';
import Link from 'next/link';

export default function RequestApprovalPage() {
    const { data: session } = useSession();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)'
        }}>
            <Link href="/" style={{
                marginBottom: 'var(--space-8)',
                color: 'var(--gray-400)',
                textDecoration: 'none'
            }}>
                ← Back to Home
            </Link>

            <RequestAdminApproval userEmail={session?.user?.email} />

            <div style={{
                marginTop: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--gray-400)'
            }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>
                    Using a personal Microsoft account?{' '}
                    <Link href="/" style={{ color: 'var(--primary-400)' }}>
                        Sign in with Outlook.com
                    </Link>
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                    <Link href="/privacy" style={{ color: 'var(--gray-400)', marginRight: 'var(--space-4)' }}>
                        Privacy Policy
                    </Link>
                    <Link href="/terms" style={{ color: 'var(--gray-400)' }}>
                        Terms of Service
                    </Link>
                </p>
            </div>
        </div>
    );
}
