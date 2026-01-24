# Azure App Registration Guide for MailVault

## Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account
3. If you don't have an Azure subscription, you can create a free account

## Step 2: Register a New Application

1. In the search bar, type **"App registrations"** and click it
2. Click **"+ New registration"**
3. Fill in the details:
   - **Name**: `MailVault`
   - **Supported account types**: Select **"Accounts in any organizational directory and personal Microsoft accounts"**
   - **Redirect URI**: 
     - Platform: **Web**
     - URL: `http://localhost:3000/api/auth/callback/microsoft`
4. Click **"Register"**

## Step 3: Note Your App Credentials

After registration, you'll see an overview page. Copy these values:

| Field | Where to find it |
|-------|------------------|
| **Application (client) ID** | Overview page, top section |
| **Directory (tenant) ID** | Overview page, top section |

## Step 4: Create a Client Secret

1. In your app, go to **"Certificates & secrets"** (left sidebar)
2. Click **"+ New client secret"**
3. Add a description (e.g., "MailVault Dev")
4. Choose expiration (24 months recommended)
5. Click **"Add"**
6. **⚠️ IMMEDIATELY copy the Value** (you won't see it again!)

## Step 5: Configure API Permissions

1. Go to **"API permissions"** (left sidebar)
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Choose **"Delegated permissions"**
5. Add these permissions:
   - `User.Read` (for profile info)
   - `Mail.Read` (to read emails)
   - `Mail.ReadWrite` (to modify/delete emails)
   - `offline_access` (for refresh tokens)
6. Click **"Add permissions"**
7. Click **"Grant admin consent"** (if you're the admin)

## Step 6: Create Environment File

Create `.env.local` in your project root with:

```env
MICROSOFT_CLIENT_ID=your_application_client_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_value_here
MICROSOFT_TENANT_ID=common
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```
Or just use a random 32+ character string.

## Summary Checklist

- [ ] App registered in Azure
- [ ] Client ID copied
- [ ] Client Secret created and copied
- [ ] API permissions added (Mail.Read, Mail.ReadWrite, User.Read)
- [ ] `.env.local` file created with credentials
