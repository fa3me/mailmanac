# OneDrive Integration Setup

## Step 1: Add OneDrive API Permission in Azure

1. Go to [Azure Portal](https://portal.azure.com) → **App registrations** → **MailVault**
2. Click **"API permissions"** in the left sidebar
3. Click **"+ Add a permission"**
4. Select **"Microsoft Graph"** → **"Delegated permissions"**
5. Search and add: **`Files.ReadWrite`**
6. Click **"Add permissions"**

## Step 2: Update Auth Scopes

The app will automatically request the new permission on next sign-in.

## Step 3: Test

Sign out and sign back in to grant the new permission.

---

## API Endpoints Added

- `POST /api/onedrive/upload` - Upload EML file to OneDrive
- Creates folder: `/MailVault Archives/[Year]/`
- Preserves email metadata in filename

## Future: MailVault Cloud

For the $0.99/mo storage tier:
- Store compressed EML files in Azure Blob Storage or AWS S3
- Simple REST API for upload/download
- User management dashboard
- Stripe/PayPal payment integration
