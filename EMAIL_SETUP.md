# Email Verification Setup Guide

## Overview

When users complete their CV, they receive a unique verification ID sent to their email address. This allows employers to verify the authenticity of CVs.

## Current Implementation

The app currently:
1. ✅ Generates unique verification IDs (format: `CV` + timestamp + random code)
2. ✅ Stores verification data with the CV
3. ✅ Has an API endpoint ready at `/api/send-verification-email`
4. ⏳ Needs email service integration to actually send emails

## How to Enable Email Sending

### Option 1: Use Resend (Recommended - Easiest)

Resend is a modern email API that's easy to set up and free for up to 3,000 emails/month.

**Step 1: Sign up for Resend**
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your domain (or use their testing domain for development)

**Step 2: Get your API Key**
1. Go to API Keys in your Resend dashboard
2. Create a new API key
3. Copy the key (starts with `re_`)

**Step 3: Add to Vercel Environment Variables**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `RESEND_API_KEY` = your API key

**Step 4: Install Resend Package**
```bash
npm install resend
```

**Step 5: Update the API Route**

Update `app/api/send-verification-email/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, fullName, verificationId } = await request.json();
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 'http://localhost:3000'}/verify?id=${verificationId}`;

    await resend.emails.send({
      from: 'CV Builder Sierra Leone <noreply@yourdomain.com>',
      to: email,
      subject: '🎉 Your CV is Ready! Verification ID Inside',
      html: `
        <h1>Congratulations, ${fullName}!</h1>
        <p>Your professional CV has been created successfully.</p>
        
        <h2>Your Verification ID: <strong>${verificationId}</strong></h2>
        
        <p>Share this verification ID with employers to prove your CV's authenticity.</p>
        
        <a href="${verificationUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Verify Your CV
        </a>
        
        <p>Or copy this link: ${verificationUrl}</p>
        
        <hr />
        <p style="color: #666; font-size: 14px;">
          CV Builder Sierra Leone - Empowering Youth Employment
        </p>
      `
    });

    return NextResponse.json({ success: true, verificationId });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

### Option 2: Use Supabase Email (Free, Requires Setup)

Supabase has built-in email functionality.

**Step 1: Enable Email in Supabase**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Email Templates
3. Customize the email templates

**Step 2: Use Supabase Auth to Send Emails**

The current API already uses Supabase. You can trigger custom emails through Supabase functions.

### Option 3: Use SendGrid (Popular Alternative)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Get your API key
3. Add `SENDGRID_API_KEY` to environment variables
4. Install: `npm install @sendgrid/mail`
5. Update the API route similar to Resend example

## Testing Email Locally

For development, you can use:
- **Resend's test mode** (free, works immediately)
- **MailHog** (local email testing server)
- **Mailtrap** (email testing service)

## Production Checklist

Before going live:
- [ ] Domain verified with your email provider
- [ ] Email templates tested
- [ ] Environment variables set in Vercel
- [ ] Unsubscribe link added (required by law)
- [ ] Rate limiting implemented
- [ ] Email logs/monitoring set up

## Current Behavior (Without Email Setup)

Right now the app:
- ✅ Generates verification IDs
- ✅ Shows them in the toast notification
- ✅ Displays them on the CV preview page
- ✅ Allows verification via the /verify page
- ⏳ Doesn't actually send emails (until you set up a service above)

Users can still copy their verification ID from the preview page and share it manually until you enable email sending.
