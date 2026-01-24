# Privacy Policy

**Last Updated: January 15, 2026**

## Introduction

MailManac ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our email archiving service.

## Information We Collect

### Account Information
- Email address (from your Google or Microsoft account)
- Display name
- Profile picture URL

### Email Data (Temporary Access)
When you use MailManac, we temporarily access:
- Email metadata (subject, sender, date, size)
- Email content (only during export operations)
- Folder/label structure

**Important**: We do NOT store your emails on our servers. All processing happens in your browser or through direct API calls to Gmail/Outlook.

## How We Use Your Information

We use the collected information to:
- Authenticate your account via OAuth 2.0
- Display email statistics and archive options
- Process export requests
- Improve our service

## Data Storage

### What We Store
- Session data (temporary, expires after logout)
- Local cache in your browser (localStorage, 30-minute duration)

### What We DON'T Store
- Email content
- Email attachments
- Access tokens on server (handled by OAuth providers)
- Passwords (we use OAuth, never handle passwords)

## Third-Party Services

We integrate with:

### Google APIs
- Gmail API for Gmail account access
- [Google Privacy Policy](https://policies.google.com/privacy)

### Microsoft Graph API
- For Outlook/Microsoft 365 access
- [Microsoft Privacy Statement](https://privacy.microsoft.com/)

## OAuth Scopes

### Gmail
- `gmail.readonly` - Read email content
- `gmail.modify` - Move emails to trash
- `drive.file` - Save archives to Google Drive

### Microsoft
- `Mail.Read` - Read email content
- `Mail.ReadWrite` - Delete emails
- `Files.ReadWrite` - Save to OneDrive

## Data Security

- All connections use HTTPS encryption
- OAuth 2.0 for secure authentication
- No passwords stored or transmitted
- Client-side processing when possible

## Your Rights

You can:
- **Revoke Access**: Remove MailManac from your Google/Microsoft account at any time
- **Clear Cache**: Delete local cached data from your browser
- **Request Deletion**: Contact us to delete any stored data

### Revoking Access
- Google: [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
- Microsoft: [account.microsoft.com/privacy](https://account.microsoft.com/privacy)

## Children's Privacy

MailManac is not intended for users under 13 years of age. We do not knowingly collect information from children.

## Changes to This Policy

We may update this Privacy Policy periodically. We will notify users of significant changes via the application.

## Contact Us

For privacy-related questions or concerns:
- Email: privacy@mailmanac.com
- Website: https://mailmanac.com/contact

## Compliance

MailManac is designed to be compliant with:
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- Google API Services User Data Policy

---

By using MailManac, you agree to this Privacy Policy.
