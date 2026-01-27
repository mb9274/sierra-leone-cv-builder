# CV Builder Sierra Leone 🇸🇱

A comprehensive citizens services platform built for Sierra Leone youth (ages 18-30) to build professional CVs, find jobs, access learning resources, and connect with essential services.

## ✨ New Features

### Mobile-First Responsive Design
- **Hamburger menu** on mobile devices with smooth slide-out navigation
- **Touch-friendly** buttons and forms optimized for smartphones
- **Arial font** throughout for maximum readability
- **Green & white theme** consistent with Sierra Leone colors

### Smart Input Validation
- **Phone numbers**: Automatic +232 Sierra Leone format (users enter 8 digits only)
- **Age verification**: Restricted to 18-30 demographic (numbers only)
- **Names**: Letters-only validation prevents data entry errors
- **Real-time feedback** on all form fields

### AI-Powered CV Enhancement (Step 7)
- **Context-aware generation**: AI analyzes ALL your entered information
- **Professional language**: Transforms basic descriptions into impactful statements
- **Action verbs**: Enhances work experience with achievement-focused language
- **Skill suggestions**: Recommends 3-5 additional relevant skills based on your background
- **Sierra Leone focus**: Optimized for local job market expectations

## Features

### CV Builder
- **7-step wizard** with guided examples and placeholder text
- **Profile photo upload** for professional presentation
- **AI-powered suggestions** available during building AND final enhancement
- **Smart validation** prevents common errors (phone format, age range, etc.)
- **CV scoring** with detailed analysis and improvement tips
- **Multiple export options** - Print, PDF, and digital sharing
- **Blockchain verification** via Solana for credential authenticity

### Job Opportunities
- **9+ Sierra Leone job listings** from real companies (Orange SL, Rokel Bank, Sierra Rutile, etc.)
- **All jobs pay 500 Leones** standardized payment system
- **Interactive map view** showing accurate job locations across Sierra Leone (Freetown, Bo, Makeni)
- **Advanced filtering** by location, job type, and category
- **Full application system** with 3-step form, cover letter, and reference submission
- **Application tracking** to monitor submission status

### Learning Center
- **13+ complete courses** across 6 categories:
  - Agriculture (Modern Farming, Agribusiness)
  - Technology (Web Development, Digital Literacy, Mobile Apps)
  - Hospitality (Customer Service, Hotel Management)
  - Business (Entrepreneurship, Financial Literacy, Marketing)
  - Healthcare (Community Health, First Aid)
  - Finance (Personal Finance)
- **Embedded video tutorials** in every lesson (plays inside the app)
- **External learning resources** linked to MDN Web Docs, freeCodeCamp, and more
- **Progress tracking** with completion badges

### Citizens Services Platform
- **Community Services** - Water access, electricity, waste disposal, youth support
- **Health Services** - Clinics, hospitals, vaccination centers, maternal health
- **Business Support** - Registration, micro-loans, market access, training
- **Government Services** - Passport, National ID, birth certificate, business license
- **Safety & Security** - Emergency hotlines, incident reporting, safe locations
- **Finance** - Mobile money integration (Orange Money, Afrimoney), Solana Pay

### AI Chatbot
- **Step-by-step guidance** for CV building, job searching, and interview prep
- **Contextual responses** based on user questions
- **Industry-specific advice** for accounting, healthcare, tech, and more
- **Explains new features** including Gemini setup, input validation, and AI enhancement
- **Works offline** with rule-based intelligent responses (no API required)

### Additional Features
- **Interview Practice** with sample questions and answers
- **Job Matching** based on skills and experience
- **Document Management** for storing certificates and credentials
- **Mobile Money Payments** for premium features
- **Solana Blockchain** integration for verification

## Tech Stack

- **Framework**: Next.js 16.0.10 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with Arial font
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API (optional)
- **Blockchain**: Solana Web3.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cv-builder-sierra-leone.git
   cd cv-builder-sierra-leone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase (Required)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Gemini AI (Optional - enables AI enhancement)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Gemini AI Setup (Optional but Recommended)

The app works without Gemini AI, but enabling it provides much better CV enhancement.

**Quick Setup:**
1. Visit [Google AI Studio](https://ai.google.dev)
2. Sign in and get a free API key
3. Add `GEMINI_API_KEY=your_key` to environment variables
4. Redeploy (if on Vercel) or restart dev server

**Detailed Instructions:** See [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md)

**Without API Key:**
- App uses smart template-based enhancements
- All features still work
- AI suggestions during building still available

## Project Structure

```
cv-builder-sierra-leone/
├── app/                    # Next.js App Router pages
│   ├── builder/           # CV Builder wizard (7 steps)
│   ├── dashboard/         # User dashboard
│   ├── jobs/              # Job listings with map
│   ├── learning/          # Learning center & courses
│   ├── applications/      # Job application tracking
│   ├── preview/           # CV preview & export
│   ├── services/          # Citizens services
│   │   ├── community/     # Community services
│   │   ├── health/        # Health services
│   │   └── ...
│   ├── api/
│   │   └── gemini/        # Gemini API route
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── chatbot.tsx       # AI chatbot
│   ├── mobile-nav.tsx    # Mobile hamburger menu
│   ├── job-application-modal.tsx
│   └── ...
├── lib/                   # Utilities and data
│   ├── types.ts          # TypeScript interfaces
│   ├── mock-jobs.ts      # Job listings data (all 500 Leones)
│   ├── mock-courses.ts   # Course data with videos
│   ├── chatbot-responses.ts  # Chatbot logic
│   └── ...
└── public/               # Static assets
```

## Usage

### Building a CV

1. Click "Build Your CV" on the homepage
2. Follow the **7-step wizard**:
   - **Step 1**: Personal Information (validated phone +232, age 18-30)
   - **Step 2**: Education History
   - **Step 3**: Work Experience
   - **Step 4**: Skills
   - **Step 5**: Languages
   - **Step 6**: Profile Photo Upload
   - **Step 7**: AI Enhancement (NEW!)
3. Click "Enhance & Save CV" to improve your content with AI
4. Preview and export your CV

### Using AI Enhancement

The AI analyzes all your information and:
- Rewrites your summary with professional language
- Enhances job descriptions with action verbs
- Suggests additional relevant skills
- Optimizes for Sierra Leone employers

### Finding Jobs

1. Navigate to "Job Opportunities"
2. Browse jobs in List View or Map View
3. Filter by location or job type
4. All jobs pay **500 Leones**
5. Click "Apply Now" to submit application

### Taking Courses

1. Go to "Learning Center"
2. Browse courses by category
3. Click a course to see lessons
4. **Watch video tutorials** embedded in the app
5. Track your progress

## Target Audience

This platform is designed for Sierra Leone youth aged **18-30 years** who are:
- Recent graduates seeking employment
- Young professionals building their careers
- Entrepreneurs starting businesses
- Anyone looking to develop new skills

## Key Validation Rules

- **Phone**: Must be 8 digits (app adds +232 automatically)
- **Age**: Must be between 18-30 years
- **Names**: Letters and spaces only
- **All fields**: Real-time validation with helpful error messages

## Mobile Optimization

- **Responsive design** works perfectly on smartphones
- **Hamburger menu** hides navigation on small screens
- **Touch-friendly** buttons and forms
- **Fast loading** optimized for mobile networks
- **Offline-capable** chatbot for areas with poor connectivity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
- Use the **AI Chatbot** in the app (bottom-right corner)
- Open an issue on GitHub
- Contact the development team

## Troubleshooting

### AI Enhancement Not Working
- Check if `GEMINI_API_KEY` is set in environment variables
- App will automatically use template fallbacks
- See [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md) for setup help

### Phone Validation Issues
- Enter only 8 digits after +232
- Example: For +232 76 123 456, enter "76123456"

### Age Restriction
- Platform is designed for 18-30 year-olds
- Enter your actual age for accurate job matching

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)
- AI powered by [Google Gemini](https://ai.google.dev)
- Blockchain integration with [Solana](https://solana.com/)

---

**Made with ❤️ for Sierra Leone** 🇸🇱

**Version**: 2.0 with Mobile-First Design & AI Enhancement
