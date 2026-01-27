# Google OAuth Authentication Setup

This app supports **Google Sign-In** for quick and easy authentication!

## For Users

Just click **"Continue with Google"** on the login or sign-up page to get started instantly. No need to remember passwords!

## For App Administrators

To enable real Google OAuth (instead of demo mode), follow these steps:

### Step 1: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and enable it
5. Click on **Google** to configure:
   - You'll need to create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
   - Create credentials (OAuth 2.0 Client ID)
   - Add authorized redirect URIs from Supabase
   - Copy the Client ID and Client Secret to Supabase

### Step 2: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Configure consent screen:
   - App name: "CV Builder Sierra Leone"
   - User support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "CV Builder SL"
   - Authorized redirect URIs: 
     - Copy from your Supabase Google provider settings
     - Format: `https://[YOUR-PROJECT].supabase.co/auth/v1/callback`

7. Copy the **Client ID** and **Client Secret**

### Step 3: Add Credentials to Supabase

1. Back in Supabase Dashboard > Authentication > Providers > Google
2. Paste your **Client ID**
3. Paste your **Client Secret**
4. Save changes

### Step 4: Test

1. Clear your browser cache
2. Go to your app's login page
3. Click "Continue with Google"
4. You should see a Google sign-in popup
5. After signing in, you'll be redirected to the dashboard

## Current Behavior

**Without Google OAuth configured:** The app uses a localStorage fallback for demo purposes. Users can still click "Continue with Google" and it will create a demo account.

**With Google OAuth configured:** Real Google authentication with proper user profiles from Google accounts.

## Benefits of Google Sign-In

- No password to remember
- Faster sign-up (one click)
- More secure (Google handles authentication)
- Users trust Google sign-in
- Auto-filled profile information

## Troubleshooting

**Issue:** "OAuth not configured" error
**Solution:** Follow the setup steps above to configure Google OAuth in Supabase

**Issue:** Redirect URI mismatch
**Solution:** Make sure the redirect URI in Google Cloud Console exactly matches the one in Supabase

**Issue:** Google sign-in popup blocked
**Solution:** Allow popups for your app's domain in browser settings

For more help, visit [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
