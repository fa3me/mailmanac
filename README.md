# MailManac

**📚 An Almanac for Your Mails**

MailManac helps you organize, archive, and reclaim storage space from your email inbox. View emails year by year, export to local storage or cloud, and support both Gmail and Outlook.

## ✨ Features

### 📊 Dashboard Overview
- Total email count and storage usage
- Quick access to archive options
- Provider-agnostic (Gmail & Outlook)

### 📅 Archive by Year
- View emails grouped by year
- Dynamic "Before [Year]" category for older emails
- Accurate email counts via API pagination

### 👤 Archive by Sender
- Top 10 senders with accurate email counts
- Search and filter senders
- Preview emails before archiving

### 📁 Archive by Folder
- View all mail folders/labels
- Archive entire folders at once

### 🔄 Duplicate Finder
- Automatically detect duplicate emails
- Archive duplicates while keeping originals

### 📦 Export Options
- **Local Download**: Single ZIP file with all emails (.eml format)
- **OneDrive**: Save directly to OneDrive (Outlook accounts)
- **Google Drive**: Coming soon

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud Console project (for Gmail)
- Azure App Registration (for Outlook)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mailmanac.git
cd mailmanac

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables (see below)

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key

# Google OAuth (for Gmail)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Azure OAuth (for Outlook)
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=common
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized redirect URI: `https://mailmanac.com/api/auth/callback/google`

### Azure App Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to App registrations
3. Create a new registration
4. Add redirect URI: `https://mailmanac.com/api/auth/callback/azure-ad`
5. Configure API permissions: `Mail.Read`, `Mail.ReadWrite`, `Files.ReadWrite`

## 📱 Usage

1. **Sign In**: Choose Gmail or Outlook
2. **Browse**: Review emails by year, sender, or folder
3. **Select**: Choose emails to archive
4. **Export**: Download as ZIP or save to cloud
5. **Optional**: Delete from mailbox after export

## 🔒 Privacy & Security

- OAuth 2.0 authentication (no passwords stored)
- Data processed locally or through official APIs
- No email content stored on our servers
- [Privacy Policy](PRIVACY_POLICY.md)
- [Terms of Service](TERMS_OF_SERVICE.md)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js
- **Styling**: Custom CSS (Glassmorphism design)
- **APIs**: Gmail API, Microsoft Graph API
- **Export**: JSZip for client-side ZIP creation

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Coming soon
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Google and Microsoft for their APIs
- JSZip for client-side compression

---

**Made with ❤️ by MailManac Team**

*"An Almanac for Your Mails"*
