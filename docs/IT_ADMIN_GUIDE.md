# IT Administrator Setup Guide

## Overview

This guide helps IT administrators configure MailVault for organizational use with Microsoft 365.

## Prerequisites

- Azure Active Directory admin access
- Microsoft 365 tenant admin privileges

---

## Step 1: Grant Admin Consent

MailVault requires the following permissions:

| Permission | Type | Purpose |
|------------|------|---------|
| `User.Read` | Delegated | Read user profile |
| `Mail.Read` | Delegated | View email metadata and content |
| `Mail.ReadWrite` | Delegated | Delete emails after export |
| `Files.ReadWrite` | Delegated | Save archives to OneDrive |
| `offline_access` | Delegated | Maintain access without re-login |

### Option A: Admin Consent URL (Recommended)

Click this URL (replace with your tenant):

```
https://login.microsoftonline.com/{tenant-id}/adminconsent?client_id=2bdfce50-8306-4432-a84d-ca2cfbcd86fb
```

### Option B: Azure Portal

1. Go to **Azure Portal** → **Azure Active Directory**
2. Navigate to **Enterprise applications**
3. Search for **"MailVault"**
4. Click **Permissions** → **Grant admin consent**

---

## Step 2: Configure User Access (Optional)

### Allow All Users
By default, all users can use granted apps.

### Restrict to Specific Users
1. In Enterprise applications → MailVault
2. Go to **Users and groups**
3. Click **Add user/group**
4. Select allowed users or security groups

---

## Step 3: Review Security

### Data Flow
```
User's Browser ←→ MailVault App ←→ Microsoft Graph API
                                    ↓
                              User's Mailbox
                              User's OneDrive
```

### Security Features
- ✅ OAuth 2.0 authentication
- ✅ No passwords stored
- ✅ HTTPS/TLS encryption
- ✅ User consent required
- ✅ Tokens stored only in user's browser

### Data Storage
- **No email data stored** on MailVault servers
- Exports saved to user's device or OneDrive
- No cloud storage by MailVault

---

## Step 4: Compliance

### GDPR Compliance
- Users can revoke access anytime
- No personal data retention
- Data processed only in user's session

### SOC 2 / HIPAA
- Contact us for enterprise compliance documentation

---

## Troubleshooting

### "Need Admin Approval" Error
1. Verify admin consent was granted
2. Check if the app is blocked in **Enterprise applications** → **Properties**
3. Ensure user is in allowed group (if restricted)

### "Permissions Error"
1. Verify all required permissions are granted
2. User may need to sign out and sign in again

### "OneDrive Access Denied"
1. Verify `Files.ReadWrite` permission is granted
2. User needs OneDrive provisioned

---

## Support

- Documentation: https://mailvault.app/docs
- Email: support@mailvault.app
- Enterprise: enterprise@mailvault.app

---

## App Information

| Property | Value |
|----------|-------|
| Application Name | MailVault |
| Application ID | `2bdfce50-8306-4432-a84d-ca2cfbcd86fb` |
| Publisher | [Your Company Name] |
| Homepage | https://mailvault.app |
| Privacy Policy | https://mailvault.app/privacy |
| Terms of Service | https://mailvault.app/terms |
