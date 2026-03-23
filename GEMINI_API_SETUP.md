# Gemini API Setup for AI CV Generation

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Add API Key to Environment

Create or update your `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**: Replace `your_gemini_api_key_here` with your actual API key.

## Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## How AI Generation Works

With the Gemini API key configured, the CV generation will:

1. **Use Real AI**: Generate comprehensive CVs using Google's Gemini AI
2. **Context-Aware**: Creates content specific to Sierra Leone job market
3. **Complete CVs**: Fills all sections with realistic, professional content
4. **Fallback**: If AI fails, falls back to enhanced templates

## Features Enabled with AI

- **Smart Summary**: Professional summary tailored to skills and experience
- **Realistic Experience**: Work experience based on provided skills
- **Relevant Education**: Appropriate degrees from Sierra Leonean universities
- **Complete Sections**: Projects, certifications, volunteering, awards, hobbies, referees
- **Local Context**: Uses Sierra Leonean companies, organizations, and formats

## Testing

Test the AI generation:

1. Navigate to CV generation page
2. Enter minimal information:
   - Name: "Mariama Bangura"
   - Email: "kamarafatmatabintal2@gmail.com"
   - Skills: "javascript, react, communication, project management"
3. Click "Generate My CV with AI"

You should see a complete, professional CV with all sections filled!

## Troubleshooting

If AI generation doesn't work:

1. **Check API Key**: Ensure `GEMINI_API_KEY` is correctly set in `.env.local`
2. **Check Network**: Verify internet connection
3. **Check Console**: Look for error messages in browser console
4. **Fallback**: System will use enhanced templates if AI fails

## API Usage

Gemini API has free tier limits:
- **Free**: 60 requests per minute
- **Paid**: Higher limits available

Each CV generation uses 1 API request.
