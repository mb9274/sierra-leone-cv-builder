# Gemini API Setup Guide

## For App Owners/Administrators

This guide will help you set up the Gemini API key so all users can benefit from AI-powered CV enhancements automatically.

## Why Gemini API?

- **Free Tier**: Google provides generous free quotas for Gemini API
- **Powerful AI**: Creates professional, context-aware CV content
- **Sierra Leone Focused**: Optimized for local job market
- **Automatic**: Once configured, works for all users without individual setup

## Setup Steps

### Step 1: Get Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [https://ai.google.dev](https://ai.google.dev)
   - Sign in with your Gmail account

2. **Create API Key**
   - Click "Get API Key" button
   - Select "Create API key in new project" (or use existing project)
   - Copy the generated API key (starts with `AIzaSy...`)
   - **Important**: Save this key securely!

### Step 2: Add to Environment Variables

#### If Deploying on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key (paste the key you copied)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your app for changes to take effect

#### If Running Locally:

1. Create or edit `.env.local` file in your project root:
   ```bash
   GEMINI_API_KEY=AIzaSy...your-key-here
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

#### If Using v0:

1. Click on **Vars** in the left sidebar
2. Add new environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key
3. Save changes

### Step 3: Verify It Works

1. Go to the CV Builder in your app
2. Complete steps 1-6 (enter all information)
3. On Step 7 (AI Enhancement), click "Enhance & Save CV"
4. You should see:
   - "Enhancing..." loading message
   - "CV Enhanced Successfully!" success message
   - Improved professional summary
   - Enhanced experience descriptions

## Usage Limits

**Free Tier Includes:**
- 60 requests per minute
- 1,500 requests per day
- More than enough for most applications!

**Monitor Usage:**
- Visit Google AI Studio dashboard
- View API usage statistics
- Set up alerts if needed

## Troubleshooting

### Error: "Using smart templates instead of AI"
- API key not configured properly
- Check environment variable spelling: `GEMINI_API_KEY`
- Ensure you've redeployed after adding the key

### Error: "Failed to generate AI content"
- API quota exceeded (wait until next day)
- Invalid API key (regenerate new key)
- Network connectivity issues

### AI Enhancement Not Working
- Check browser console for detailed error messages
- Verify API key is active in Google AI Studio
- Ensure environment variable is set correctly

## For Users

Once the administrator has set up the Gemini API key:

✅ **No setup required for individual users**
✅ **AI enhancement works automatically**
✅ **Just complete your CV and click "Enhance & Save CV"**

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `.env.local` to `.gitignore`
   - Use environment variables only

2. **Regenerate keys if exposed**
   - Go to Google AI Studio
   - Delete compromised key
   - Generate new key

3. **Monitor usage regularly**
   - Check for unusual activity
   - Set up alerts for high usage

## Cost Considerations

- **Current Status**: Gemini API is FREE for moderate usage
- **Future**: If Google changes pricing, consider:
  - Setting usage limits per user
  - Premium tier for unlimited AI enhancements
  - Alternative: Template-based fallbacks already built-in

## Alternative: User-Provided API Keys

If you prefer users to provide their own API keys:

1. Users go to **Settings** → **Gemini AI Setup**
2. Follow wizard to get their own free API key
3. Enter key in the app
4. AI features work with their personal key

This approach:
- ✅ No cost to app owner
- ✅ Users control their own quotas
- ❌ More friction (users must set up)
- ❌ Some users may skip AI features

## Support

For questions or issues:
- Check chatbot in the app (ask "how to set up gemini ai")
- Review error messages in browser console
- Contact technical support team

---

**Last Updated**: December 2024  
**Gemini API Version**: v1beta  
**Documentation**: https://ai.google.dev/docs
