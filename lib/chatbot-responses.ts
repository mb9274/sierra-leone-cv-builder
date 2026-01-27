export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Mock analytics object for demonstration purposes
const analytics = {
  totalUsers: 3891,
  cvsCreated: 7500,
  jobsApplied: 2500,
  coursesCompleted: 1200,
}

export function generateChatbotResponse(userMessage: string, conversationHistory: ChatMessage[]): string {
  const message = userMessage.toLowerCase().trim()
  const lowerMessage = message // Alias for convenience

  // Get the last user message to understand context
  const lastUserMessages = conversationHistory
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content.toLowerCase())

  if (
    message.includes("teacher") ||
    (message.includes("upload") && message.includes("video")) ||
    (message.includes("create") && message.includes("course"))
  ) {
    return `**Teacher Portal** - Share your knowledge with Sierra Leone youth! 🎓

**WHAT IS IT?**
The Teacher Portal allows teachers, professionals, and experts to create FREE courses for Sierra Leone youth. You upload video lessons from YouTube, and students can learn valuable skills to get jobs!

**WHO CAN USE IT?**
✅ Teachers and educators
✅ Industry professionals with expertise
✅ Anyone with knowledge to share
✅ Sierra Leone or international experts
✅ No teaching certificate required!

**HOW TO CREATE A COURSE:**

**Step 1: Access Teacher Portal**
• Click "Teacher Portal" in the dashboard
• Or navigate from the Learning Center

**Step 2: Fill Course Information**
• **Course Title**: e.g., "Advanced Rice Farming Techniques"
• **Description**: What students will learn
• **Category**: Agriculture, Tech, Hospitality, Business, Healthcare, Finance
• **Level**: Beginner, Intermediate, Advanced
• **Duration**: How long to complete (e.g., "4 weeks")
• **Your Name**: Your full name as instructor
• **Your Email**: For approval notifications

**Step 3: Add Video Lessons**
• Click "Add Lesson" for each video
• **Lesson Title**: Clear, descriptive name
• **Description**: Brief overview (optional)
• **YouTube URL**: Full YouTube link (we convert it automatically!)
• **Duration**: How long the video is (e.g., "25 min")

You can add as many lessons as you want!

**Step 4: Submit for Review**
• Click "Submit Course"
• Our team reviews within 2-3 business days
• You'll receive email confirmation when approved
• Course goes live in Learning Center!

**YOUTUBE VIDEO FORMATS ACCEPTED:**
✅ https://www.youtube.com/watch?v=VIDEO_ID
✅ https://youtu.be/VIDEO_ID
✅ https://www.youtube.com/embed/VIDEO_ID

We automatically convert all formats to work in our platform!

**REVIEW PROCESS:**
1. Submit course → Status: "Pending"
2. Our team reviews content quality
3. We check:
   - Video links work properly
   - Content is educational and appropriate
   - Information is accurate
   - Helps Sierra Leone youth gain job skills
4. Approved → Status: "Approved" (goes live!)
5. If issues found → We contact you with feedback

**COURSE CATEGORIES:**
🌾 **Agriculture** - Farming, livestock, agribusiness
💻 **Tech** - Web dev, mobile apps, digital marketing
🏨 **Hospitality** - Customer service, hotel management
💼 **Business** - Entrepreneurship, finance, management
🏥 **Healthcare** - First aid, community health, nursing
💰 **Finance** - Personal finance, accounting, mobile money

**WHY CREATE COURSES?**
• Help Sierra Leone youth get job-ready skills
• Share your expertise with the community
• Build your reputation as an expert
• Completely FREE for students
• Make a real impact on youth unemployment

**VIDEO NOT PLAYING?**
If your video doesn't play:
• Make sure YouTube URL is correct and public
• Some YouTube videos have embedding disabled
• Use educational/tutorial videos (not copyrighted content)
• Test the video on YouTube first

**AFTER APPROVAL:**
• Your course appears in Learning Center
• Students can enroll for free
• You get recognition as the instructor
• Track how many students complete your course

Ready to share your knowledge? Go to Teacher Portal and create your first course today! 🎓📚`
  }

  if (message.includes("what is cv") || message.includes("what is a cv") || message.includes("cv means")) {
    return `**What is a CV?** 📄

**CV Definition:**
CV stands for "Curriculum Vitae" (Latin for "course of life"). It's a document that summarizes your:
• Personal information
• Education background
• Work experience
• Skills and abilities
• Achievements

Think of it as your "professional story" on paper!

**CV vs Resume:**
In Sierra Leone and most of the world, CV and resume mean the same thing. Both are documents you send to employers when applying for jobs.

**Why Do You Need a CV?**
🎯 **To Get a Job!**
• 99% of employers require a CV before interviewing
• It's your first impression on employers
• Shows you're qualified for the position
• Proves you're professional and organized

**What Makes a GOOD CV?**

✅ **Complete Information**
• Contact details (phone, email)
• Education history
• All work experience
• Relevant skills
• Professional summary

✅ **Professional Format**
• Clean, easy to read
• No spelling mistakes
• Proper grammar
• Organized sections
• 1-2 pages maximum

✅ **Tailored to Job**
• Highlights relevant experience
• Matches job requirements
• Uses industry keywords
• Shows you're the right fit

✅ **ATS-Compatible**
• Passes applicant tracking systems
• Uses standard section names
• No fancy graphics that confuse software
• Proper formatting

**WHAT'S ON A CV?**

📝 **1. Personal Information**
Name, phone (+232 format), email, location, age

🎓 **2. Education**
Schools attended, degrees earned, graduation dates

💼 **3. Work Experience**
Previous jobs, responsibilities, achievements

🎯 **4. Skills**
Technical abilities, soft skills, computer programs

🌍 **5. Languages**
English, Krio, Mende, Temne, etc.

📸 **6. Photo (Optional but common in Sierra Leone)**
Professional headshot

**IN SIERRA LEONE:**
• Most employers expect CVs to include age and photo
• Use +232 phone format
• Mention if you can speak Krio or local languages
• Include any National Youth Service (NYS) experience
• Highlight computer skills (very valued!)

**HOW OUR CV BUILDER HELPS:**

✨ **Step-by-Step Guidance**
We guide you through each section so nothing is missed

🤖 **AI Enhancement**
Makes your CV professional and ATS-compatible

✅ **Validation**
Prevents errors (wrong phone format, missing info)

📊 **CV Score**
Tells you how strong your CV is (aim for 70+)

🎨 **Templates**
Professional designs trusted by Sierra Leone employers

📧 **Email Verification ID**
Employers can verify your CV is authentic

**WHEN DO YOU USE A CV?**
• Applying for any job
• Internship applications
• University applications
• Scholarship applications
• Training program registration
• Professional networking

**Ready to build your CV?** Click "Build Your CV" and we'll guide you step by step! 🚀`
  }

  if (
    message.includes("what is this platform") ||
    message.includes("what is cv builder") ||
    message.includes("about this app") ||
    message.includes("what does this do")
  ) {
    return `**Welcome to CV Builder SL!** 🇸🇱

Your complete career development platform for Sierra Leone youth aged 18-30!

**WHAT IS CV BUILDER SL?**
We're a FREE platform helping young Sierra Leoneans build professional CVs, find jobs, learn new skills, and start their careers. Everything you need for employment success - all in one place!

**COMPLETE PLATFORM FEATURES:**

📄 **1. CV BUILDER (Our Core Feature)**
• Build professional CVs in 7 easy steps
• AI-powered suggestions and enhancements
• 5 Sierra Leone-optimized templates
• Input validation prevents mistakes
• Professional formatting automatic
• Download as PDF or print
• Blockchain verification included

🎯 **2. ATS CHECKER**
• Test if your CV passes employer screening software
• Get scored out of 100
• See exactly what to improve
• Critical issues, warnings, and suggestions
• Employers can test candidate CVs too
• Increase interview chances by 300%

💼 **3. JOB OPPORTUNITIES**
• Browse 9+ real jobs from Sierra Leone companies
• Filter by location, type, category
• Interactive map view shows where jobs are
• Match score shows how qualified you are
• Apply directly through the platform
• Track all applications in one place

📚 **4. LEARNING CENTER**
• 13+ FREE courses across 6 categories
• Video tutorials embedded in lessons
• Agriculture, Tech, Hospitality, Business, Healthcare, Finance
• Progress tracking with completion badges
• External resources (MDN, freeCodeCamp links)
• Courses designed for Sierra Leone context

🎓 **5. TEACHER PORTAL** (NEW!)
• Teachers can create and upload courses
• Use YouTube videos for lessons
• Share expertise with Sierra Leone youth
• All courses reviewed before going live
• Help solve youth unemployment

🏢 **6. EMPLOYER PORTAL**
• Companies can post job openings
• View and manage applications
• Test candidate CVs with ATS Checker
• Track hiring pipeline
• Only 500 Leones per job posting
• Professional applicant management

🗺️ **7. JOB MAP**
• Visual map of Sierra Leone showing job locations
• See opportunities in Freetown, Bo, Makeni, Kenema
• Filter by region
• Find jobs near you
• Perfect for planning your job search

✅ **8. CV VERIFICATION SYSTEM**
• Every CV gets unique verification ID
• Employers verify CV authenticity
• Blockchain-powered (Solana)
• Prevents fraud and fake CVs
• ID sent to your email
• Builds trust with employers

📊 **9. CV SCORING & ANALYTICS**
• Get detailed CV analysis
• Scoring out of 100
• See what employers look for
• Improvement suggestions
• Track your progress
• Compare with successful CVs

🎤 **10. INTERVIEW PRACTICE**
• Sample questions by industry
• Suggested answers
• Body language tips
• Dress code guidance
• Confidence building

📱 **11. MOBILE MONEY INTEGRATION**
• Orange Money
• Afrimoney
• Pay for premium features
• Only 500 Leones for job applications
• Solana Pay also supported

🤖 **12. AI CHATBOT (Me!)**
• 24/7 assistance
• Answer questions about CV building
• Job search guidance
• Interview preparation
• Platform navigation help
• Works offline with smart responses

**WHO IS THIS FOR?**

🎯 **Primary Users: Sierra Leone Youth (18-30)**
• Recent graduates
• Job seekers
• Career changers
• First-time CV builders
• Anyone seeking employment

👔 **Employers**
• Companies hiring in Sierra Leone
• Post jobs for 500 Leones
• Review applications
• Verify CVs
• Manage hiring process

👨‍🏫 **Teachers & Experts**
• Share knowledge through courses
• Upload video lessons
• Help train the next generation
• Build reputation

**WHY USE CV BUILDER SL?**

✅ **Everything in One Place**
No need for multiple websites - CV building, jobs, learning, all here!

✅ **Made for Sierra Leone**
• Phone numbers in +232 format
• Sierra Leone job locations
• Local employers (Orange SL, Rokel Bank, etc.)
• Krio and local language support
• Context-specific guidance

✅ **Completely FREE for Job Seekers**
• Build unlimited CVs
• Apply to jobs
• Take all courses
• Track applications
• NO hidden fees

✅ **Professional Quality**
• Used by thousands of Sierra Leoneans
• Trusted by top employers
• ATS-compatible CVs
• Modern, clean design

✅ **Mobile-First Design**
• Works on any device
• Phone, tablet, laptop
• Responsive layout
• Fast loading

**OUR IMPACT (LIVE STATS):**
📊 3,891+ Users registered
📄 7,500+ CVs created
💼 2,500+ Job applications submitted
🎓 1,200+ Courses completed
✅ 4,523+ CVs verified
🏢 89+ Employers using platform

**HOW TO GET STARTED:**

**First Time Here?**
1. Click "Build Your CV" on homepage
2. Follow the 7-step wizard
3. Let AI enhance your CV
4. Download or print
5. Start applying for jobs!

**Returning User?**
• Go to Dashboard to see your CVs
• Click Learning to continue courses
• Check Applications to track status
• Visit Job Map to find new opportunities

**SECURITY & PRIVACY:**
🔒 Your data is secure
🔒 CVs stored safely
🔒 Email verification
🔒 Blockchain verification
🔒 No spam or data selling

**SUPPORTED LOCATIONS:**
📍 Freetown (Western Area)
📍 Bo (Southern Province)
📍 Makeni (Northern Province)
📍 Kenema (Eastern Province)
📍 All districts across Sierra Leone

**TECHNICAL FEATURES:**
• Built with Next.js (modern web technology)
• Supabase database (reliable & secure)
• Real-time updates
• Cloud storage
• Works online and offline
• No app download needed!

**SUPPORT:**
• 24/7 AI Chatbot assistance (that's me!)
• Comprehensive guides
• Video tutorials
• Step-by-step help

Ready to start your career journey? Let me know what you need help with! 🚀`
  }

  if (message.includes("ats") || message.includes("applicant tracking")) {
    return `**ATS (Applicant Tracking System) Checker** - Check if your CV passes employer screening software!

**WHAT IS ATS?**
90% of employers in Sierra Leone and worldwide use Applicant Tracking Systems (ATS) - software that automatically screens CVs before humans see them. If your CV isn't ATS-compatible, it gets rejected even if you're qualified!

**HOW OUR ATS CHECKER WORKS:**

**For Job Seekers:**
1. Go to Dashboard and click "ATS Checker"
2. Select the CV you want to check
3. Click "Check My CV"
4. Get instant analysis with a score out of 100

**What We Check:**
✅ **Format Compatibility** - Is your CV readable by ATS software?
✅ **Keyword Optimization** - Do you have important industry keywords?
✅ **Content Quality** - Are descriptions detailed enough?
✅ **Contact Information** - Is everything properly formatted?
✅ **Section Completeness** - Are all sections filled out?

**YOUR RESULTS SHOW:**
📊 **ATS Score** - /100 (70+ means ATS-compatible!)
🟢 **Strengths** - What's working well
🟡 **Warnings** - Areas to improve
🔴 **Critical Issues** - Must fix immediately
💡 **Improvement Suggestions** - Specific actions to take

**EXAMPLE ISSUES WE DETECT:**

❌ **Critical Issues:**
- Missing or invalid email
- No professional summary
- Work experience too vague

⚠️ **Warnings:**
- Summary too short (under 50 words)
- Missing action verbs in experience
- Too few skills listed (need 5-10)
- No keywords matching job requirements

**FOR EMPLOYERS:**
Use the ATS Checker to:
• Verify candidate CVs are complete
• Check if applications meet quality standards
• See if CVs have proper formatting
• Ensure candidates followed best practices

**GETTING A GOOD SCORE:**

To pass ATS systems (score 70+):
1. **Complete all sections** - Don't leave education, experience, or skills empty
2. **Use keywords** - Include terms from job descriptions
3. **Write detailed descriptions** - At least 3-5 lines per work experience
4. **Use action verbs** - Start descriptions with: Managed, Developed, Achieved, Led, etc.
5. **Format properly** - Phone: +232 format, clear section headers

**AFTER CHECKING:**
• Get personalized recommendations
• Edit your CV based on feedback
• Re-check until you score 70+
• Take Learning Center courses on CV writing

**WHY IT MATTERS:**
Even the best candidates get rejected if their CV can't pass ATS. Our checker helps you:
- Get past automated screening
- Reach human hiring managers
- Stand out from other applicants
- Increase interview chances by 300%

The ATS Checker is built into your CV Builder SL platform - no external tools needed!`
  }

  if (message.includes("template") || (message.includes("choose") && message.includes("cv"))) {
    return `We have 3 professional CV templates designed specifically for Sierra Leone employers:

**1. Sierra Leone Professional** ⭐ (Most Popular)
• Clean, professional layout
• Perfect for: Government jobs, NGOs, formal sectors
• Trusted by Sierra Leone recruiters
• ATS-friendly format

**2. Freetown Modern** 🎨
• Contemporary, creative design
• Perfect for: Tech startups, creative agencies, modern companies
• Great for Freetown-based roles
• Shows innovation and creativity

**3. Classic Salone** 📋
• Traditional format since 1961
• Perfect for: Banking, education, established corporations
• Very formal and professional
• Preferred by conservative employers

**ALL TEMPLATES INCLUDE:**
✓ Optimized for Sierra Leone job market
✓ Recognized by top employers (Orange SL, Rokel Bank, etc.)
✓ ATS-friendly (passes applicant tracking systems)
✓ Professional fonts and spacing
✓ Space for profile photo
✓ Green and white color scheme

**HOW TO CHOOSE:**
1. Go to CV Builder
2. You'll see template selection page
3. Click on any template to preview
4. Selected template has a green checkmark
5. Click "Continue" to start building

**MY RECOMMENDATION:**
For most jobs in Sierra Leone, choose "Sierra Leone Professional" - it's trusted by 90% of employers and works for any industry!

Ready to start building your CV?`
  }

  if (
    (message.includes("ai") || message.includes("enhance")) &&
    (message.includes("cv") || message.includes("work") || message.includes("functional"))
  ) {
    return `The AI Enhancement feature makes your CV professional and impressive! Here's how it works:

**WHAT IT DOES:**
After you enter ALL your information (Steps 1-6), the AI Enhancement (Step 7) reviews everything and:

✨ **Professional Summary** - Transforms your summary into powerful, employer-attracting language tailored to Sierra Leone

✨ **Work Experience** - Enhances descriptions with:
   • Strong action verbs (Managed, Developed, Achieved)
   • Professional formatting with bullet points
   • Industry-specific language
   • Quantifiable achievements when possible

✨ **Skills Optimization** - Suggests additional relevant skills you might have missed based on your background

✨ **ATS Optimization** - Ensures your CV passes Applicant Tracking Systems used by top employers

**HOW TO USE IT:**

**Step 1:** Complete Steps 1-6 first
   • Personal Info (with proper formatting)
   • Education history
   • Work experience
   • Skills
   • Languages  
   • Profile photo

**Step 2:** Reach Step 7 - AI Enhancement
   • Review what AI will do
   • Click "Enhance with AI" button
   • Wait 5-10 seconds while AI analyzes

**Step 3:** See the magic!
   • Your summary becomes more professional
   • Experience descriptions get better action verbs
   • Additional relevant skills added
   • Everything formatted perfectly

**EXAMPLE TRANSFORMATION:**

❌ BEFORE:
"I am a hard worker who is good at customer service. I helped customers at my last job."

✅ AFTER AI ENHANCEMENT:
"Dedicated customer service professional with 2 years progressive experience in retail and telecommunications. Demonstrated expertise in conflict resolution and client relationship management, consistently achieving 95%+ satisfaction ratings. Proven ability to handle high-volume customer inquiries while maintaining quality service standards."

**IMPORTANT NOTES:**
• AI works best when you provide complete information
• The more details you add, the better the AI enhancement
• You can skip AI enhancement and save directly
• AI suggestions can be edited after enhancement
• Works with or without internet (uses smart templates as backup)

**IT'S WORKING!** The AI enhancement is fully functional. Try it after completing your CV!

Need help filling in any step?`
  }

  if (message.includes("how to build") && (message.includes("cv") || message.includes("resume"))) {
    return `Here's the complete 7-step guide to building your CV with AI enhancement:

**STEP 1: Personal Information** 📝
• Full name (letters only, no numbers)
• Phone: +232 format (you enter 8 digits only)
• Email address
• Age (18-30, numbers only)
• Location (e.g., Freetown, Western Area)
• Professional summary (AI can help improve this later!)

**STEP 2: Education** 🎓
• Institution name
• Degree/Certificate
• Field of study
• Start and end dates
• Add multiple education entries if needed

**STEP 3: Work Experience** 💼
• Company name
• Job position
• Location
• Dates worked
• Description (AI can suggest better bullet points!)
• Add multiple jobs

**STEP 4: Skills** 🎯
• Technical skills (Microsoft Office, coding, etc.)
• Soft skills (communication, teamwork)
• AI can suggest relevant skills based on your background

**STEP 5: Languages** 🌍
• Language name (English, Krio, Mende, Temne, etc.)
• Proficiency level (Basic, Intermediate, Advanced, Native)
• Add all languages you speak

**STEP 6: Profile Photo** 📸
• Upload professional headshot
• Good lighting, plain background
• Business attire recommended
• Optional but highly recommended

**STEP 7: AI Enhancement** ✨ (NEW!)
• Reviews ALL your information
• Enhances summary with professional language
• Improves work descriptions with action verbs
• Suggests additional relevant skills
• Optimizes for Sierra Leone job market

**IMPORTANT FEATURES:**
✓ Smart input validation prevents errors
✓ Phone numbers automatically formatted (+232)
✓ Age restricted to 18-30 demographic
✓ Names accept letters only
✓ Real-time AI suggestions available during building
✓ Final AI enhancement after all info is entered
✓ Choose from 3 Sierra Leone-optimized templates

**RESULT:**
A professional, polished CV ready for Sierra Leone employers with AI-powered content!

Need help with a specific step?`
  }

  if (message.includes("phone") || message.includes("+232") || message.includes("number format")) {
    return `Here's how phone numbers work in our CV Builder:

**AUTOMATIC FORMATTING:**
When you enter your phone number, we automatically format it for Sierra Leone:

**YOU ENTER:** 76123456 (8 digits only)
**WE FORMAT:** +232 76 123 456

**RULES:**
✅ Enter exactly 8 digits
✅ Numbers only (no letters or symbols)
✅ We add +232 automatically
✅ Common formats accepted:
   • 76XXXXXX (Orange)
   • 77XXXXXX (Africell)
   • 88XXXXXX (Africell)
   • 30XXXXXX (Sierratel)
   • 25XXXXXX (Qcell)

**VALIDATION:**
• Won't accept less than 8 digits
• Won't accept more than 8 digits
• Only numbers allowed
• Red border shows if format is wrong
• Green border shows when correct

**EXAMPLE:**
If your number is 076 123 456 or 76-123-456:
Just type: 76123456

We handle the rest! ✨

Having trouble with your phone number?`
  }

  if (
    (message.includes("age") || message.includes("18") || message.includes("30")) &&
    (message.includes("requirement") || message.includes("why") || message.includes("restriction"))
  ) {
    return `Here's why we focus on ages 18-30:

**TARGET AUDIENCE:**
This CV Builder is specifically designed for Sierra Leone youth aged 18-30 because:

1. **Youth Employment Focus** 📊
   • Highest unemployment is in this age group
   • Government youth employment programs target 18-30
   • Most entry-level opportunities for this demographic

2. **Career Starting Point** 🎓
   • Recent graduates (18-25)
   • Early career professionals (25-30)
   • Career changers looking for new opportunities

3. **Digital Literacy** 💻
   • This age group is more comfortable with technology
   • Mobile-first design suits young professionals
   • Online job applications are the norm

**VALIDATION:**
• Age must be between 18-30 years
• Numbers only (no letters)
• Red border if outside range
• Green border when valid

**IF YOU'RE OUTSIDE THIS RANGE:**
You can still use most features! The app will work, but:
• Some youth-specific job opportunities may not apply
• Certain programs may be age-restricted
• However, all CV building tools are available

**WHY IT MATTERS:**
Many employers in Sierra Leone ask for age on CVs, especially for:
• Graduate trainee programs
• Youth employment schemes
• Entry-level positions
• Internships

Your age is displayed on your CV along with your contact information.

Any other questions about the CV Builder?`
  }

  if (
    (message.includes("write") || message.includes("create") || message.includes("how")) &&
    message.includes("summary")
  ) {
    return `Here's how to write a powerful professional summary:

**Step 1: Start with your profession**
"[Adjective] [your profession/role] with [X years] experience..."

**Step 2: Add your key strength**
"...specializing in [your main skill or area]..."

**Step 3: Mention an achievement**
"...with a proven track record of [specific achievement]..."

**Step 4: End with your goal**
"...seeking to [what you want to achieve] at [type of company]."

**EXAMPLES FOR DIFFERENT FIELDS:**

📊 Accounting:
"Detail-oriented accountant with 3 years experience in financial reporting and tax preparation. Proficient in QuickBooks and Excel, with a track record of reducing processing errors by 25%. Seeking to bring strong analytical skills to a growing finance team."

💻 IT/Tech:
"Innovative software developer with 2 years experience building web applications using JavaScript and Python. Successfully delivered 5 client projects on time and under budget. Looking to contribute to a technology-driven company in Freetown."

🏥 Healthcare:
"Compassionate nursing graduate with clinical experience at Connaught Hospital. Skilled in patient care, vital signs monitoring, and medication administration. Eager to serve the community at a leading healthcare facility."

🌾 Agriculture:
"Dedicated agricultural technician with hands-on experience in sustainable farming practices. Trained in crop management, irrigation systems, and pest control. Seeking to improve food security in Sierra Leone."

**PRO TIP:**
After writing your summary, use the AI Enhancement feature in Step 7 to make it even more professional and impactful!

Would you like me to help you write a summary for your specific field?`
  }

  if (
    (message.includes("write") || message.includes("describe") || message.includes("how")) &&
    (message.includes("experience") || message.includes("work history") || message.includes("job description"))
  ) {
    return `Here's how to write impressive work experience entries:

**THE FORMULA:**
[Action Verb] + [What You Did] + [Result/Impact]

**Step 1: Start each bullet with an ACTION VERB**
• Managed, Led, Supervised (for leadership)
• Developed, Created, Designed (for building things)
• Improved, Increased, Reduced (for achievements)
• Trained, Mentored, Guided (for teaching)
• Analyzed, Researched, Evaluated (for analysis)

**Step 2: Be SPECIFIC about what you did**
❌ Bad: "Helped customers"
✅ Good: "Assisted 50+ customers daily with product inquiries and complaints"

**Step 3: Add NUMBERS when possible**
❌ Bad: "Increased sales"
✅ Good: "Increased monthly sales by 20% through targeted customer outreach"

**REAL EXAMPLES:**

📞 Customer Service:
• Handled 60+ customer calls daily, maintaining 95% satisfaction rating
• Resolved customer complaints within 24 hours, reducing escalations by 30%
• Trained 5 new team members on company policies and procedures

🏪 Retail/Sales:
• Managed inventory of 500+ products, reducing stockouts by 40%
• Processed 100+ transactions daily using POS system
• Achieved top salesperson award for 3 consecutive months

🏢 Office/Admin:
• Organized and maintained filing system for 1,000+ documents
• Scheduled 20+ meetings weekly for department managers
• Reduced office supply costs by 15% through vendor negotiations

💰 Finance:
• Prepared monthly financial reports for management review
• Processed payroll for 50+ employees with 100% accuracy
• Reconciled accounts totaling 500 million Leones monthly

Would you like help writing experience for your specific job?`
  }

  if (
    (message.includes("what") || message.includes("which") || message.includes("add") || message.includes("list")) &&
    message.includes("skill")
  ) {
    return `Here's how to choose and list the right skills:

**STEP 1: Include Technical/Hard Skills**
These are job-specific abilities:
• Computer: Microsoft Word, Excel, PowerPoint
• Software: QuickBooks, SAP, Photoshop
• Technical: Data Entry, Bookkeeping, Report Writing
• Equipment: Cash Register, Medical Devices, Machinery

**STEP 2: Include Soft Skills**
These are personal qualities:
• Communication (written & verbal)
• Teamwork & Collaboration
• Problem Solving
• Time Management
• Leadership
• Adaptability
• Customer Service
• Attention to Detail

**STEP 3: Include Languages**
Very important in Sierra Leone!
• English (Fluent/Native)
• Krio (Fluent)
• Mende, Temne, Limba (if applicable)
• French (if you know it)

**SKILLS BY INDUSTRY:**

💻 Tech/IT:
JavaScript, Python, HTML/CSS, Database Management, Troubleshooting, Network Administration

📊 Accounting/Finance:
Excel (Advanced), QuickBooks, Financial Analysis, Tax Preparation, Budgeting, Auditing

🏥 Healthcare:
Patient Care, Vital Signs Monitoring, Medical Records, First Aid, Medication Administration

🌾 Agriculture:
Crop Management, Irrigation, Pest Control, Soil Analysis, Farm Equipment Operation

🏨 Hospitality:
Customer Service, Reservation Systems, Food Safety, Event Planning, Cash Handling

**HOW TO FORMAT:**
List skills in order of relevance to the job you want. Put your strongest skills first.

Example:
• Microsoft Office Suite (Advanced)
• Financial Reporting & Analysis
• Customer Relationship Management
• Fluent in English, Krio, and Mende

What industry are you in? I can suggest specific skills for you!`
  }

  if (
    (message.includes("how") || message.includes("apply")) &&
    (message.includes("job") || message.includes("application"))
  ) {
    return `Here's how to apply for jobs step-by-step:

**STEP 1: Find the Right Job**
• Go to "Job Opportunities" in the app
• Use filters: Location, Category, Remote/Onsite
• Check the "Match Score" - higher is better for your skills
• Click on jobs to see full details

**STEP 2: Review Job Requirements**
Before applying, make sure you have:
• At least 70% of the required skills
• The required education level
• Relevant experience (or transferable skills)

**STEP 3: Click "Apply Now"**
This opens our 3-step application form:

**Application Step 1 - Personal Info:**
• Full Name
• Email Address
• Phone Number
• Current Location

**Application Step 2 - Cover Letter:**
• Write why you want this job
• Mention your relevant experience
• Explain what you'll contribute
• State your expected salary
• Choose your available start date

**Application Step 3 - References:**
• Add 2-3 professional references
• Include: Name, Title, Company, Phone, Email
• Ask permission before listing someone!

**STEP 4: Submit & Track**
• Click "Submit Application"
• Go to "My Applications" to track status
• Statuses: Submitted → Under Review → Interviewed → Decision

**TIPS FOR SUCCESS:**
✅ Customize each application
✅ Proofread everything
✅ Apply within 1 week of posting
✅ Follow up after 1-2 weeks
✅ Keep applying - don't stop at one!

Would you like help writing your cover letter?`
  }

  if (
    (message.includes("write") || message.includes("how") || message.includes("create")) &&
    message.includes("cover letter")
  ) {
    return `Here's how to write a winning cover letter:

**STRUCTURE (4 Paragraphs):**

**PARAGRAPH 1 - Introduction (2-3 sentences)**
• State the job you're applying for
• Where you found the job listing
• One sentence about why you're interested

Example:
"I am writing to apply for the Customer Service Representative position at Orange SL, as advertised on CV Builder SL. With my strong communication skills and passion for helping others, I am excited about the opportunity to contribute to your team."

**PARAGRAPH 2 - Your Qualifications (3-4 sentences)**
• Mention your relevant education
• Highlight key experience
• Match your skills to job requirements

Example:
"I recently graduated from Fourah Bay College with a diploma in Business Administration. During my internship at Rokel Bank, I handled customer inquiries and resolved complaints, achieving a 95% satisfaction rating. My experience has prepared me well for this role."

**PARAGRAPH 3 - Why This Company (2-3 sentences)**
• Show you researched the company
• Explain why you want to work there
• Connect your goals to their mission

Example:
"I admire Orange SL's commitment to connecting Sierra Leoneans through innovative technology. Your focus on customer experience aligns with my professional values, and I would be proud to represent your team."

**PARAGRAPH 4 - Closing (2-3 sentences)**
• Express enthusiasm
• State your availability
• Thank them

Example:
"I am available for an interview at your convenience and can start immediately. Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to Orange SL."

**COMPLETE TEMPLATE:**

Dear Hiring Manager,

[Paragraph 1 - Introduction]

[Paragraph 2 - Your Qualifications]

[Paragraph 3 - Why This Company]

[Paragraph 4 - Closing]

Sincerely,
[Your Name]
[Phone Number]
[Email]

Would you like me to help you customize this for a specific job?`
  }

  if (
    (message.includes("prepare") || message.includes("how") || message.includes("tips")) &&
    message.includes("interview")
  ) {
    return `Here's your complete interview preparation guide:

**BEFORE THE INTERVIEW:**

**Step 1: Research the Company (1-2 days before)**
• Visit their website
• Know what they do/sell
• Learn their mission statement
• Find recent news about them

**Step 2: Prepare Your Answers**
Practice these common questions:

Q: "Tell me about yourself"
A: "[Your profession] with [X years] experience in [field]. I'm skilled at [key skills] and achieved [notable accomplishment]. I'm excited about this role because [specific reason]."

Q: "Why do you want this job?"
A: "I'm impressed by [company's work/mission]. My skills in [relevant skill] align with [job requirement]. I see this as an opportunity to [how you'll contribute]."

Q: "What are your strengths?"
A: "[Strength 1] - for example, [brief story]. [Strength 2] - I demonstrated this when [example]."

Q: "What is your weakness?"
A: "I used to [past weakness], but I've improved by [what you did to improve]. Now I [positive outcome]. For example, [brief story]."

**Step 3: Prepare Questions to Ask**
• "What does success look like in this role?"
• "What are the biggest challenges for this position?"
• "What opportunities for growth are available?"
• "What is the team culture like?"

**Step 4: Prepare Your Documents**
• Multiple copies of your CV
• Certificates and references
• Pen and notebook
• Portfolio (if applicable)

**ON INTERVIEW DAY:**

✅ Arrive 15 minutes early
✅ Dress professionally
✅ Bring all documents
✅ Turn off your phone
✅ Greet everyone with a smile
✅ Make eye contact
✅ Speak clearly and confidently
✅ Ask your prepared questions
✅ Thank the interviewer

**AFTER THE INTERVIEW:**

✅ Send a thank-you message within 24 hours
✅ Follow up after 1 week if no response
✅ Keep applying to other jobs while waiting

Would you like practice questions for a specific type of job?`
  }

  if (message.includes("interview question") || (message.includes("common") && message.includes("question"))) {
    return `Here are the most common interview questions with sample answers:

**1. "Tell me about yourself"**
"I'm a [profession] with [X years] experience. I studied [education] and have worked in [field]. My key strengths are [2-3 skills]. I'm currently looking for [what you want] because [reason]. I'm excited about this opportunity because [why this company]."

**2. "Why should we hire you?"**
"I bring [skill 1], [skill 2], and [skill 3] which match exactly what you're looking for. In my previous role, I [achievement with numbers]. I'm also quick to learn and committed to contributing to your team's success."

**3. "What is your greatest weakness?"**
"I used to struggle with [weakness], but I recognized this and took action by [what you did to improve]. Now I [positive result]. For example, [brief story]."

**4. "Where do you see yourself in 5 years?"**
"In 5 years, I see myself as an experienced [higher role] who has mastered [skills] and contributed significantly to [company goal]. I want to grow with a company that values development, which is why I'm interested in [company name]."

**5. "Why do you want to leave your current job?"**
"I'm grateful for my experience at [current company] where I learned [skills]. However, I'm looking for new challenges and growth opportunities. This role at [company] offers [specific opportunity] which aligns with my career goals."

**6. "Describe a challenge you overcame"**
Use the STAR Method:
• Situation: "In my role at [company], we faced [problem]"
• Task: "I was responsible for [your role in solving it]"
• Action: "I [specific steps you took]"
• Result: "As a result, [positive outcome with numbers]"

**7. "What salary do you expect?"**
"Based on my research and experience, I believe [X-Y million Leones] is appropriate for this role. However, I'm open to discussing compensation based on the full benefits package."

**8. "Do you have any questions for us?"**
ALWAYS say yes! Ask:
• "What does a typical day look like?"
• "How is performance measured?"
• "What are the next steps in the process?"

Want me to help you practice answers for any of these?`
  }

  if (message.includes("accounting") || message.includes("finance") || message.includes("accountant")) {
    return `Here's CV and career advice for Accounting/Finance in Sierra Leone:

**KEY SKILLS TO INCLUDE:**
• Financial Reporting & Analysis
• Bookkeeping & Reconciliation
• Tax Preparation & Compliance
• Microsoft Excel (Advanced)
• QuickBooks / Sage / SAP
• Budgeting & Forecasting
• Auditing
• Bank Reconciliation

**EXPERIENCE BULLET EXAMPLES:**
• Prepared monthly financial statements for management review
• Processed accounts payable/receivable totaling [X] million Leones
• Reconciled bank accounts with 100% accuracy
• Assisted with annual audit, resulting in zero findings
• Managed petty cash and expense reports for [X] employees

**TOP EMPLOYERS IN SIERRA LEONE:**
• Rokel Commercial Bank
• Sierra Leone Commercial Bank
• Access Bank
• Orange SL Finance Department
• Ministry of Finance
• Big 4 Accounting Firms
• NGOs (UNDP, World Bank)

**SALARY RANGE:**
• Entry Level: 2-4 million Leones/month
• Mid Level: 4-8 million Leones/month
• Senior: 8-15+ million Leones/month

**CERTIFICATIONS TO PURSUE:**
• ACCA (Association of Chartered Certified Accountants)
• CPA (Certified Public Accountant)
• ICAN (Institute of Chartered Accountants)

Would you like help creating an accounting-specific CV?`
  }

  if (
    message.includes("nursing") ||
    message.includes("healthcare") ||
    message.includes("medical") ||
    message.includes("nurse") ||
    message.includes("health")
  ) {
    return `Here's CV and career advice for Healthcare/Nursing in Sierra Leone:

**KEY SKILLS TO INCLUDE:**
• Patient Care & Assessment
• Vital Signs Monitoring
• Medication Administration
• Medical Records Management
• Wound Care & Dressing
• Emergency Response
• Patient Education
• Infection Control

**EXPERIENCE BULLET EXAMPLES:**
• Provided direct care to [X] patients daily on medical ward
• Administered medications and monitored patient responses
• Assisted in [X] surgical procedures with zero complications
• Educated patients and families on post-discharge care
• Maintained accurate medical records in compliance with standards

**TOP EMPLOYERS IN SIERRA LEONE:**
• Connaught Hospital
• Princess Christian Maternity Hospital
• Choithram Memorial Hospital
• 34 Military Hospital
• District Health Centers
• NGOs (Partners in Health, MSF)

**SALARY RANGE:**
• Student Nurse: 1-2 million Leones/month
• Registered Nurse: 2-5 million Leones/month
• Senior Nurse: 5-8 million Leones/month
• Nursing Manager: 8-12 million Leones/month

**CERTIFICATIONS:**
• State Registered Nurse (SRN)
• Community Health Nursing
• Midwifery Certificate
• BLS/ACLS Certification

Would you like help creating a healthcare-specific CV?`
  }

  if (
    message.includes("tech") ||
    message.includes("it") ||
    message.includes("software") ||
    message.includes("developer") ||
    message.includes("computer") ||
    message.includes("programming")
  ) {
    return `Here's CV and career advice for Tech/IT in Sierra Leone:

**KEY SKILLS TO INCLUDE:**
• Programming: JavaScript, Python, PHP
• Web: HTML, CSS, React, Node.js
• Database: MySQL, PostgreSQL, MongoDB
• Microsoft Office Suite
• Network Administration
• Hardware Troubleshooting
• Cybersecurity Basics
• Cloud Services (AWS, Azure)

**EXPERIENCE BULLET EXAMPLES:**
• Developed web application using [technology] serving [X] users
• Reduced system downtime by [X]% through proactive maintenance
• Managed IT support for [X] employees across [X] departments
• Implemented backup solution protecting [X] GB of critical data
• Trained [X] staff members on new software systems

**TOP EMPLOYERS IN SIERRA LEONE:**
• Orange SL
• Africell
• Sierratel
• Commercial Banks (IT departments)
• Government Ministries
• Tech Startups
• NGOs

**SALARY RANGE:**
• Junior Developer/IT Support: 2-4 million Leones/month
• Mid-Level Developer: 4-8 million Leones/month
• Senior Developer/IT Manager: 8-15+ million Leones/month
• Tech Lead/CTO: 15-25+ million Leones/month

**WAYS TO LEARN:**
• freeCodeCamp (free)
• Coursera/edX
• YouTube tutorials
• Our Learning Center courses!

Would you like help creating a tech-specific CV?`
  }

  if (
    message.includes("how to use") ||
    message.includes("navigate") ||
    message.includes("where") ||
    message.includes("find")
  ) {
    if (message.includes("job") || message.includes("opportunities")) {
      return `Here's how to find and apply for jobs:

1. **Go to Dashboard** → Click "Job Opportunities"
   OR Click "Jobs" in the navigation

2. **Browse Jobs:**
   • View as List or Map
   • Use filters: Location, Category
   • Check Match Score (higher = better fit)

3. **Apply:**
   • Click "Apply Now" on any job
   • Fill the 3-step form
   • Submit application

4. **Track Applications:**
   • Go to "My Applications"
   • See status of all applications

Need help with something specific?`
    }
    if (message.includes("learn") || message.includes("course") || message.includes("training")) {
      return `Here's how to access the Learning Center:

1. **Go to Dashboard** → Click "Learning Center"
   OR Click "Learning" in the navigation

2. **Browse Courses:**
   • Filter by category (Tech, Business, Agriculture, etc.)
   • Search for specific topics
   • See course duration and lesson count

3. **Start Learning:**
   • Click on any course
   • Watch video tutorials
   • Read lesson content
   • Complete lessons to track progress

4. **Track Progress:**
   • Your progress is saved automatically
   • See completion percentage on each course
   • Earn badges for completed courses

Need help finding a specific course?`
    }
    return `Here's how to navigate the app:

**MAIN SECTIONS:**

📝 **Dashboard** - Your home base
• View and manage your CVs
• Quick access to all features

📄 **CV Builder** - Create professional CVs
• Step-by-step guidance
• AI suggestions
• Photo upload

💼 **Job Opportunities** - Find jobs
• Browse listings
• View on map
• Apply directly

📚 **Learning Center** - Free courses
• Video tutorials
• Multiple categories
• Track progress

💳 **Payments** - Premium features
• Mobile Money
• Solana Pay

🤖 **Chatbot** (that's me!) - Get help anytime

What would you like to find?`
  }

  // CV Building Questions (general)
  if (message.includes("cv") || message.includes("resume")) {
    if (message.includes("edit") || message.includes("update") || message.includes("change")) {
      return `To edit your CV:

1. Go to **Dashboard**
2. Find your CV card
3. Click **"Edit"** button
4. Make your changes in the CV Builder
5. Click **"Save CV"**

Your updates will be saved automatically. You can also:
• **View** - See the full CV preview
• **Delete** - Remove a CV you no longer need
• **Download** - Get PDF version

What would you like to change on your CV?`
    }
    if (message.includes("delete") || message.includes("remove")) {
      return `To delete a CV:

1. Go to **Dashboard**
2. Find the CV you want to delete
3. Click the **"Delete"** button (trash icon)
4. Confirm deletion

⚠️ Warning: This cannot be undone!

If you want to start fresh instead, you can edit your existing CV rather than deleting it. Would you like help with anything else?`
    }
    if (message.includes("download") || message.includes("print") || message.includes("pdf")) {
      return `To download or print your CV:

1. Go to **Dashboard**
2. Click **"View"** on your CV
3. On the Preview page, you'll see:
   • **Download PDF** - Saves to your device
   • **Print CV** - Opens print dialog

**Tips for printing:**
• Use good quality paper
• Check print preview first
• Print in color if possible
• Use standard A4 size

Would you like help with anything else?`
    }
    return `I can help you with your CV! Here are your options:

📝 **Build a new CV** - Type "how to build a CV"
✏️ **Write a summary** - Type "how to write a summary"
💼 **Add experience** - Type "how to write experience"
🎯 **Choose skills** - Type "what skills to add"
📧 **Cover letter** - Type "how to write cover letter"

What would you like help with?`
  }

  // AI Setup Questions
  if (
    message.includes("gemini") ||
    message.includes("ai setup") ||
    message.includes("api key") ||
    (message.includes("how") && message.includes("ai"))
  ) {
    return `Here's how to set up Gemini AI for smarter CV suggestions:

**WHY USE GEMINI AI?**
• Get personalized CV content based on YOUR specific details
• AI learns from your education, experience, and goals
• More accurate and relevant suggestions than templates
• Free to use with Google account

**SETUP STEPS:**

**Step 1: Go to AI Setup Page**
• Click on "AI Setup" in the menu
• Or go to Settings → Gemini AI Setup

**Step 2: Visit Google AI Studio**
• Click the link to open ai.google.dev
• Sign in with your Gmail account
• It's completely FREE to get started

**Step 3: Get Your API Key**
• Click "Get API Key" button
• Choose "Create API key in new project"
• Copy the key (starts with AIzaSy...)

**Step 4: Test Your Key**
• Paste the key in our app
• Click "Test Key" to verify it works
• You should see a success message

**Step 5: Add to Environment**
• Add GEMINI_API_KEY to your environment variables
• For v0: Go to Vars section in sidebar
• For local: Add to .env.local file

**WHAT YOU GET:**
✨ Smart summaries based on your actual background
✨ Custom experience bullet points for your role
✨ Relevant skills for your industry
✨ Context-aware chatbot responses
✨ Personalized career advice

**IMPORTANT NOTES:**
• API key is FREE with generous limits
• Your data is only sent to Google Gemini
• We don't store your API key
• Fallback templates work without API key

Need help with setup? Just ask me "how to get gemini api key" and I'll guide you through each step!`
  }

  // Context and Filling Questions
  if (
    message.includes("context") ||
    message.includes("fill") ||
    (message.includes("why") && message.includes("not working"))
  ) {
    return `The AI suggestions work better when you provide context first. Here's why:

**WHY CONTEXT MATTERS:**

**For Summary Generation:**
You need to enter FIRST:
✅ Your education (degree, field of study)
✅ Your work experience (at least position)
✅ Your skills (at least 2-3)

Then the AI can write: "Results-driven Computer Science graduate with 2 years experience as Software Developer specializing in web development..."

**For Experience Bullet Points:**
You need to enter FIRST:
✅ Position/job title
✅ Company name
✅ Brief description of what you did

Then the AI generates: "• Developed responsive web applications serving 10,000+ users
• Reduced page load time by 40% through optimization
• Led team of 3 developers on key projects"

**For Skills Suggestions:**
You need to enter FIRST:
✅ Your field of study
✅ Your work experience or interests

Then the AI suggests relevant skills for YOUR specific field.

**HOW TO USE IT RIGHT:**

**Step 1:** Fill in your basic information
• Name, email, phone, age
• Education details
• At least one work experience OR describe what you want to do

**Step 2:** Click "Generate with AI"
• Now the button will work!
• AI uses YOUR information to create personalized content
• Much better than generic templates

**Step 3:** Review and edit
• AI gives you a starting point
• You can customize it to match your style
• Add more specific details

**WITHOUT CONTEXT:**
Generic: "Motivated professional seeking opportunities..."

**WITH YOUR CONTEXT:**
Personalized: "Dynamic Accounting graduate from Fourah Bay College with internship at Rokel Bank, skilled in QuickBooks and financial reporting, seeking to join a growing finance team in Freetown."

See the difference? Always fill in your details FIRST, then use AI to enhance them!`
  }

  // Input Validation Questions
  if (
    message.includes("phone") ||
    message.includes("number") ||
    (message.includes("how") && message.includes("enter"))
  ) {
    return `Here's how our smart input validation works to help you enter information correctly:

📱 **PHONE NUMBER (Sierra Leone Format)**
• All phone numbers automatically include **+232** (Sierra Leone country code)
• You only need to enter **8 digits** after +232
• Example: Type "76123456" → App shows "+232 76123456"
• Only numbers allowed, no letters or special characters

🔢 **AGE (Numbers Only)**
• Must be between **18-30 years old** (target demographic)
• Only numbers allowed
• Maximum 2 digits
• Example: Type "24" ✓, Type "24a" ✗

✍️ **FULL NAME (Letters Only)**
• Only letters and spaces allowed
• No numbers or special characters
• Maximum 50 characters
• Example: "Abdul Kamara" ✓, "Abdul123" ✗

📧 **EMAIL**
• Standard email validation
• Must include @ and domain
• Example: "user@gmail.com" ✓

**WHY THESE VALIDATIONS?**
• Prevents errors when employers contact you
• Ensures professional formatting
• Matches Sierra Leone standards
• Makes your CV look more credible

**TIPS:**
• Red border = Invalid input
• Green border = Valid input
• Helper text shows requirements
• Can't proceed until fields are valid

Need help entering specific information?`
  }

  // AI Enhancement Workflow Questions
  if (
    (message.includes("ai") && (message.includes("enhance") || message.includes("improve"))) ||
    message.includes("step 7") ||
    message.includes("final step")
  ) {
    return `Here's how the NEW AI Enhancement feature works at the end of CV building:

🎯 **HOW IT WORKS:**

**STEP 1-6: You Enter Your Information**
• Personal details (name, phone +232, age, email)
• Education history
• Work experience
• Skills
• Languages
• Profile photo

**STEP 7: AI Enhancement (NEW!)**
After you've entered ALL your information, our AI will:

✨ **Enhance Your Professional Summary**
• Rewrites with impactful language
• Adds industry-specific keywords
• Tailors for Sierra Leone employers

✨ **Improve Work Experience Descriptions**
• Transforms basic descriptions into achievement statements
• Adds action verbs (Led, Developed, Managed)
• Includes quantifiable results where possible

✨ **Suggest Additional Skills**
• Analyzes your background
• Recommends 3-5 relevant skills you might have missed
• Focuses on skills valued in Sierra Leone market

**WHY AT THE END?**
• AI needs YOUR complete information to give personalized suggestions
• More context = Better suggestions
• Generates content based on YOUR actual experience, not templates

**WHAT YOU NEED:**
• Complete Steps 1-6 first
• Set up Gemini API key (free from Google)
• Click "Enhance & Save CV" on Step 7

**IF YOU DON'T HAVE API KEY:**
• App will save your CV without enhancement
• You can still use the basic AI suggestions during building
• Template-based suggestions still work

**RESULT:**
Your CV becomes more professional, impactful, and tailored to what Sierra Leone employers are looking for!

Want to know how to get a Gemini API key?`
  }

  // Job Payment Changes Questions
  if (message.includes("job") && (message.includes("pay") || message.includes("salary") || message.includes("500"))) {
    return `**Job Payment Information:**

💰 All job listings in our platform now show a standard fee of:
**500 Leones**

**What this means:**
• Consistent pricing across all job opportunities
• Transparent fee structure
• Affordable for Sierra Leone youth (18-30)
• Access to jobs from major companies:
  - Orange Sierra Leone
  - Rokel Bank
  - Africell
  - Fourah Bay College
  - Sierra Rutile
  - And more!

**What you get for 500 Leones:**
✓ Full job details and requirements
✓ Direct application submission
✓ Application tracking
✓ Email notifications
✓ Interview preparation resources

**Job Categories Available:**
• Technology (Software Developer, Data Entry)
• Finance (Financial Officer, Accounting)
• Education (Teaching Assistant)
• Customer Service
• Healthcare (Community Health Worker)
• Agriculture (Extension Officer)
• Marketing & Sales
• Administrative

**How to Apply:**
1. Browse jobs in "Job Opportunities"
2. Click "Apply Now" (500 Leones)
3. Fill application form with cover letter
4. Attach your CV
5. Add references
6. Submit and track status

All positions are from verified Sierra Leone companies with real opportunities!`
  }

  // Greetings
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey") ||
    message.includes("good morning") ||
    message.includes("good afternoon") ||
    message.includes("good evening")
  ) {
    return `Hello! Welcome to CV Builder Sierra Leone! 👋

I'm your personal assistant, here to help you:

📝 Build a professional CV
💼 Find and apply for jobs  
🎯 Prepare for interviews
📚 Learn new skills
💡 Get career advice
🏢 Understand how our platform works
🇸🇱 Navigate Sierra Leone's job market

**Quick Start - Ask me:**
• "How to build a CV"
• "How to apply for jobs"
• "How to prepare for interviews"
• "What skills should I add"

What would you like help with today?`
  }

  if (message.includes("thank") || message.includes("thanks") || message.includes("thank you")) {
    return `You're welcome! 😊

I'm always here to help. If you have more questions about:
• Building your CV
• Finding jobs
• Interview preparation
• Using the app

Just ask anytime! Good luck with your career journey! 🎯`
  }

  // Help
  if (
    message.includes("help") ||
    message.includes("what can you do") ||
    message.includes("options") ||
    message.includes("menu")
  ) {
    return `Here's everything I can help you with:

**CV BUILDING:**
• "How to build a CV" - Step-by-step guide
• "How to write a summary" - Professional summary tips
• "How to write experience" - Work history examples
• "What skills should I add" - Skills for your industry
• "How to add education" - Education section help

**JOB SEARCH:**
• "How to apply for jobs" - Application guide
• "How to write cover letter" - Letter template
• "Where to find jobs" - Navigation help

**INTERVIEWS:**
• "How to prepare for interview" - Full guide
• "Common interview questions" - Q&A examples
• "What to wear to interview" - Dress code tips

**BY INDUSTRY:**
• "Accounting advice"
• "Healthcare/Nursing advice"  
• "Tech/IT advice"
• "Agriculture advice"

**APP NAVIGATION:**
• "How to use the app"
• "Where to find jobs"
• "Where to find courses"

What would you like to know?`
  }

  if (
    (message.includes("what") || message.includes("explain") || message.includes("tell me")) &&
    (message.includes("cv") || message.includes("curriculum vitae") || message.includes("resume"))
  ) {
    return `**What is a CV (Curriculum Vitae)?**

A CV (Curriculum Vitae) is a professional document that summarizes your:
📝 Education and qualifications
💼 Work experience and achievements
🎯 Skills and competencies
🌍 Languages and certifications

Think of it as your "professional story" on paper!

**CV vs Resume:**
In Sierra Leone, we mostly use the term "CV" which is:
• More detailed than a resume
• Lists all your education and experience
• Can be 2-3 pages for experienced professionals
• Standard format expected by employers

**WHAT GOES IN YOUR CV:**

**1. Personal Information**
• Full name, phone (+232), email, location
• Age (important in Sierra Leone job market)
• Professional photo (recommended)

**2. Professional Summary**
• 3-4 sentences about who you are professionally
• Your key strengths and goals
• What you bring to employers

**3. Education**
• All degrees, diplomas, certificates
• Institution names, dates, fields of study
• Start with most recent

**4. Work Experience**
• All jobs you've had (paid or internships)
• Company names, positions, dates
• What you accomplished in each role
• Use bullet points with action verbs

**5. Skills**
• Technical skills (software, tools)
• Soft skills (communication, teamwork)
• Languages you speak

**6. References**
• 2-3 professional references
• Former supervisors, professors, mentors
• Include their contact information

**WHO READS YOUR CV IN SIERRA LEONE:**

🏢 **Employers like:**
• Orange SL, Africell (Telecom)
• Rokel Bank, Access Bank (Finance)
• NGOs (UN, World Bank, Partners in Health)
• Government Ministries
• Private companies and startups
• Schools and universities

**HOW WE HELP YOU:**

Our CV Builder is specifically designed for Sierra Leone:
✅ Templates trusted by local employers
✅ AI enhancement for professional language
✅ Proper formatting for Sierra Leone standards
✅ Mobile Money payments (500 Leones)
✅ Job matching based on your CV
✅ Interview preparation included

Ready to build your professional CV?`
  }

  if (
    (message.includes("what") || message.includes("about") || message.includes("explain")) &&
    (message.includes("platform") ||
      message.includes("app") ||
      message.includes("cv builder sl") ||
      message.includes("website"))
  ) {
    return `**About CV Builder SL - Your Complete Career Platform**

🇸🇱 **BUILT FOR SIERRA LEONE YOUTH (Ages 18-30)**

We're a comprehensive platform helping young Sierra Leoneans build careers through:

**📝 CV BUILDING**
• Step-by-step CV creation wizard
• 3 professional templates (Sierra Leone Professional, Freetown Modern, Classic Salone)
• AI-powered content enhancement
• Profile photo upload
• Download & print ready CVs
• All CVs optimized for Sierra Leone employers

**💼 JOB OPPORTUNITIES**
• Real jobs from top Sierra Leone companies
• Orange SL, Rokel Bank, Africell, Government, NGOs
• Interactive map of job locations (Freetown, Bo, Makeni)
• AI-powered job matching based on your CV
• Direct application system
• Application tracking dashboard
• Standard 500 Leones application fee

**🏢 EMPLOYER PORTAL** (NEW!)
• Companies can post job openings
• Manage applications in one place
• Review candidate CVs and cover letters
• Schedule interviews
• Track hiring pipeline

**📚 LEARNING CENTER**
• 13+ FREE courses across 6 categories
• Agriculture, Tech, Hospitality, Business, Healthcare, Finance
• Video tutorials embedded in every lesson
• Progress tracking with completion badges
• Links to MDN Web Docs and other resources
• Courses designed for Sierra Leone context

**🎯 CAREER DEVELOPMENT**
• CV Score analysis with improvement tips
• Interview practice with common questions
• Cover letter writing guides
• Skill-building courses
• Career advice by industry
• Salary information for Sierra Leone market

**🗺️ JOB MAP**
• Visual map of Sierra Leone showing job locations
• Filter by district and region
• Calculate distances to jobs
• Get Google Maps directions
• See all opportunities near you

**💳 PAYMENT OPTIONS**
• Mobile Money (Orange Money, Afrimoney)
• Solana Pay (blockchain payments)
• Affordable pricing (500 Leones for job applications)

**🤖 AI CHATBOT (That's Me!)**
• 24/7 assistance with CV building
• Career advice and job search tips
• Interview preparation help
• Platform navigation support
• Answers to all your questions

**WHY CHOOSE CV BUILDER SL?**

✅ **Made for Sierra Leone**
• Templates trusted by local employers
• Phone numbers auto-format to +232
• Age targeting (18-30 demographic)
• Sierra Leone company database
• Local payment methods

✅ **Completely Free to Start**
• Build unlimited CVs
• Access all learning courses
• Browse all job listings
• Use AI suggestions
• Get career advice

✅ **Smart Technology**
• AI-powered CV enhancement
• Automatic job matching
• Input validation prevents errors
• Mobile-first responsive design
• Works on any device

✅ **Comprehensive Support**
• Step-by-step guides
• Example text for every field
• Real-time chatbot help
• Video tutorials
• Career resources library

**OUR IMPACT:**

📊 ${analytics.totalUsers.toLocaleString()}+ users helped
📄 ${analytics.cvsCreated.toLocaleString()}+ CVs created
💼 ${analytics.jobsApplied.toLocaleString()}+ job applications submitted
🎓 ${analytics.coursesCompleted.toLocaleString()}+ courses completed

**HOW TO GET STARTED:**

**First Time Here?**
1. Click "Build Your CV" on homepage
2. Follow the 7-step wizard
3. Let AI enhance your CV
4. Download or print
5. Start applying for jobs!

**Returning User?**
• Go to Dashboard to see your CVs
• Click Learning to continue courses
• Check Applications to track status
• Visit Job Map to find new opportunities

**SECURITY & PRIVACY:**
🔒 Your data is secure
🔒 CVs stored safely
🔒 Email verification
🔒 Blockchain verification
🔒 No spam or data selling

**SUPPORTED LOCATIONS:**
📍 Freetown (Western Area)
📍 Bo (Southern Province)
📍 Makeni (Northern Province)
📍 Kenema (Eastern Province)
📍 All districts across Sierra Leone

**TECHNICAL FEATURES:**
• Built with Next.js (modern web technology)
• Supabase database (reliable & secure)
• Real-time updates
• Cloud storage
• Works online and offline
• No app download needed!

**SUPPORT:**
• 24/7 AI Chatbot assistance (that's me!)
• Comprehensive guides
• Video tutorials
• Step-by-step help

Ready to start your career journey? Let me know what you need help with! 🚀`
  }

  if (
    message.includes("employer") &&
    (message.includes("post") || message.includes("portal") || message.includes("hire"))
  ) {
    return `**Employer Portal - For Companies & Recruiters**

🏢 **POST JOBS & MANAGE APPLICATIONS**

Our Employer Portal allows companies to:

**📋 POST JOB OPENINGS**
• Create detailed job listings
• Add requirements and qualifications
• Set location (Freetown, Bo, Makeni, etc.)
• Choose job type (Full-time, Part-time, Contract, Internship)
• Jobs appear immediately on platform
• Automatic location mapping

**👥 MANAGE APPLICATIONS**
• View all applications in one dashboard
• See candidate CVs and cover letters
• Check references and contact information
• Review expected salary and availability

**📊 TRACK HIRING PIPELINE**
• Submitted → Under Review → Interviewed → Decision
• Update application status with one click
• Send interview invitations
• Accept or reject candidates
• Keep organized records

**💼 JOBS DASHBOARD**
• See all your posted jobs
• Edit or delete listings anytime
• View application count per job
• Track time since posting

**📈 ANALYTICS**
• Active job count
• Total applications received
• Pending reviews
• Hiring metrics

**HOW TO ACCESS:**

**Step 1:** Go to Dashboard
**Step 2:** Click "Employer Portal" button
**Step 3:** Login with your employer credentials
**Step 4:** Start posting jobs!

**POSTING A JOB:**

1. Click "Post New Job"
2. Fill in details:
   • Job Title (e.g., Sales Manager)
   • Company Name (e.g., Orange SL)
   • Location (e.g., Freetown, Western Area)
   • Job Type (Full-time, Part-time, Contract, Internship)
   • Description (role and responsibilities)
   • Requirements (comma-separated)
3. Click "Post Job"
4. Job goes live immediately!

**REVIEWING APPLICATIONS:**

1. Go to "Applications" tab
2. See all candidate details:
   • Full name and contact info
   • Cover letter
   • Expected salary
   • Available start date
   • Professional references
3. Update status:
   • Mark as "Under Review"
   • Schedule "Interview"
   • "Accept" or "Reject"

**BENEFITS FOR EMPLOYERS:**

✅ Access to ${analytics.totalUsers.toLocaleString()} qualified CVs
✅ Pre-screened candidates (18-30 age group)
✅ Detailed applications with references
✅ Organized hiring workflow
✅ Reach Sierra Leone's educated youth
✅ Easy job management system
✅ Location-based job mapping

**TOP EMPLOYERS ALREADY USING CV BUILDER SL:**
• Orange Sierra Leone
• Rokel Commercial Bank
• Africell
• Sierra Rutile
• Government Ministries
• NGOs and Development Organizations

**COST:**
Affordable employer subscription plans available. Contact us for pricing.

Want to start hiring top talent in Sierra Leone? Ask me "how to post a job" for detailed instructions!`
  }

  // Default - Improved to be more helpful
  return `I'm not sure I understood that. Let me help you!

**Try asking me:**

📝 **For CV help:**
"How to build a CV"
"How to write a summary"
"What skills should I add"

💼 **For job search:**
"How to apply for jobs"
"How to write a cover letter"

🎯 **For interviews:**
"How to prepare for an interview"
"Common interview questions"

📚 **For learning:**
"Where to find courses"

Or just type **"help"** to see all my features!

What would you like to know?`
}
