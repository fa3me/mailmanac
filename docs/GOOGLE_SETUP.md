# Google Cloud Setup for Gmail Integration

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"**
3. Name: `MailVault` → Click **Create**

## Step 2: Enable Gmail API

1. In the project, go to **APIs & Services** → **Library**
2. Search for **"Gmail API"** → Click it → **Enable**
3. Also enable **"Google Drive API"** for cloud storage export

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** → Click **Create**
3. Fill in:
   - App name: `MailVault`
   - User support email: `your-email@example.com`
   - Developer contact: `your-email@example.com`
4. Click **Save and Continue**
5. **Scopes** → Add:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/drive.file`
6. **Test users** → Add your email for testing
7. Save and continue

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `MailVault Web`
5. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://your-production-domain.com`
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-production-domain.com/api/auth/callback/google`
7. Click **Create**
8. Copy **Client ID** and **Client Secret**

## Step 5: Add Environment Variables

Add to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 6: Test

1. Restart the dev server
2. Click "Sign in with Google" on the landing page
3. Grant permissions when prompted

---

## API Scopes Used

| Scope | Purpose |
|-------|---------|
| `gmail.readonly` | Read email messages and metadata |
| `gmail.modify` | Delete/archive emails after export |
| `drive.file` | Save exports to Google Drive |
