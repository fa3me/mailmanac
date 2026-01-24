import DashboardLayout from './components/DashboardLayout';

export const metadata = {
    title: 'Dashboard - MailManac',
    description: 'Manage your Outlook email archive',
};

export default function DashboardRootLayout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
