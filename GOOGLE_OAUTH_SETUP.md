# Google OAuth Setup Instructions

## 🔧 Step-by-Step Google OAuth Configuration

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Create a new project or select existing project

### 2. Enable Google+ API
- Go to **APIs & Services** → **Library**
- Search for "Google+ API" and enable it
- Also enable "Google People API"

### 3. Create OAuth Credentials
- Go to **APIs & Services** → **Credentials**
- Click **+ CREATE CREDENTIALS** → **OAuth client ID**
- Choose **Web application**
- Name: "ESSE Naturals" (or any name)

### 4. Configure Authorized URLs
**Authorized JavaScript origins:**
```
http://localhost:3005
```

**Authorized redirect URIs:**
```
http://localhost:3005/api/auth/callback/google
```

### 5. Copy Credentials
After creation, copy:
- **Client ID**: starts with something like `123456789-abc...googleusercontent.com`
- **Client secret**: starts with something like `GOCSPX-...`

### 6. Update Environment Variables
In `.env.local`, replace:
```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### 7. Test Google Login
1. Start your dev server: `npm run dev`
2. Go to `/auth` page
3. Click "Continue with Google"
4. Should redirect to Google and back successfully

## ❗ Common Issues & Solutions

### Issue: "redirect_uri_mismatch"
**Solution**: Make sure the redirect URI in Google Console exactly matches:
```
http://localhost:3005/api/auth/callback/google
```

### Issue: "invalid_client"
**Solution**: Double-check your Client ID and Secret are correct

### Issue: "access_blocked"
**Solution**: Make sure your app is in "Testing" mode in OAuth consent screen

## 🔒 Production Setup
For production, add your production domain:
```
https://yourdomain.com
https://yourdomain.com/api/auth/callback/google
```
