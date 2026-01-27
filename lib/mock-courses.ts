import type { Course } from "./types"

export const mockCourses: Course[] = [
  // AGRICULTURE COURSES
  {
    id: "course-1",
    title: "Modern Farming Techniques",
    description: "Learn sustainable farming methods to increase crop yields and improve soil health.",
    category: "Agriculture",
    duration: "4 weeks",
    level: "Beginner",
    instructor: "Dr. Ahmed Kamara",
    enrolledCount: 234,
    rating: 4.8,
    thumbnail: "/idyllic-farmland.png",
    externalResources: [
      {
        title: "FAO Sustainable Agriculture Guide",
        url: "https://www.fao.org/sustainable-development-goals/overview/en/",
        type: "article",
      },
    ],
    lessons: [
      {
        id: "lesson-1-1",
        title: "Introduction to Sustainable Farming",
        content:
          "Sustainable farming is an approach that focuses on producing food while protecting the environment, supporting farm workers, and benefiting local communities.\n\nKey topics covered:\n- Understanding soil health\n- Water conservation techniques\n- Natural pest control\n- Crop rotation benefits\n\nBy the end of this lesson, you'll understand why sustainable farming is crucial for long-term agricultural success.",
        duration: "15 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/fSEtiixgRJI",
        videoTitle: "Introduction to Sustainable Agriculture",
        resources: [
          { title: "FAO: Sustainable Food Systems", url: "https://www.fao.org/sustainability/en/", type: "article" },
        ],
      },
      {
        id: "lesson-1-2",
        title: "Soil Preparation and Management",
        content:
          "Healthy soil is the foundation of successful farming. In this lesson, you'll learn how to prepare and maintain your soil for optimal crop growth.\n\nTopics include:\n- Testing soil pH levels\n- Adding organic matter\n- Creating compost\n- Preventing soil erosion\n\nPractical exercises will help you assess your own farmland.",
        duration: "20 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/uAMniWJm2vo",
        videoTitle: "Soil Health Fundamentals",
        resources: [],
      },
      {
        id: "lesson-1-3",
        title: "Water Management Systems",
        content:
          "Efficient water use is critical in Sierra Leone's climate. Learn how to maximize water efficiency.\n\nYou'll discover:\n- Drip irrigation setup\n- Rainwater harvesting\n- Scheduling irrigation\n- Dealing with dry seasons",
        duration: "25 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/Y8n7LhQq2o0",
        videoTitle: "Drip Irrigation for Small Farms",
        resources: [],
      },
      {
        id: "lesson-1-4",
        title: "Crop Selection and Rotation",
        content:
          "Choosing the right crops and rotating them properly can dramatically improve yields.\n\nLearn about:\n- Best crops for Sierra Leone regions\n- Seasonal planting schedules\n- Crop rotation patterns\n- Companion planting",
        duration: "18 min",
        order: 4,
        videoUrl: "https://www.youtube.com/embed/98DgHYksRD0",
        videoTitle: "Crop Rotation Explained",
        resources: [],
      },
    ],
  },
  {
    id: "course-agriculture-2",
    title: "Poultry Farming for Beginners",
    description: "Start your own poultry business with practical knowledge on raising chickens for meat and eggs.",
    category: "Agriculture",
    duration: "3 weeks",
    level: "Beginner",
    instructor: "Mariama Jalloh",
    enrolledCount: 178,
    rating: 4.7,
    thumbnail: "/idyllic-farmland.png",
    externalResources: [],
    lessons: [
      {
        id: "lesson-ag2-1",
        title: "Getting Started with Poultry",
        content:
          "Learn the basics of starting a poultry farm including choosing breeds, housing requirements, and initial investment needs.\n\nTopics:\n- Local chicken breeds vs imported\n- Building a chicken coop\n- Equipment needed\n- Startup costs estimation",
        duration: "20 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/4yVRkfSLKTA",
        videoTitle: "Poultry Farming Basics",
        resources: [],
      },
      {
        id: "lesson-ag2-2",
        title: "Feeding and Nutrition",
        content:
          "Proper nutrition is key to healthy birds and profitable farming.\n\nLearn about:\n- Feed formulation\n- Local feed alternatives\n- Feeding schedules\n- Water requirements",
        duration: "25 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/r5YwCbCCMng",
        videoTitle: "Poultry Feed Management",
        resources: [],
      },
      {
        id: "lesson-ag2-3",
        title: "Health Management and Disease Prevention",
        content:
          "Keep your flock healthy with proper disease prevention and management.\n\nTopics:\n- Common poultry diseases in Sierra Leone\n- Vaccination schedules\n- Biosecurity measures\n- When to call a vet",
        duration: "30 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/2F8vAQsQCIA",
        videoTitle: "Poultry Health Management",
        resources: [],
      },
    ],
  },

  // TECH COURSES
  {
    id: "course-2",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript to build modern websites and start your tech career.",
    category: "Tech",
    duration: "6 weeks",
    level: "Beginner",
    instructor: "James Koroma",
    enrolledCount: 567,
    rating: 4.9,
    thumbnail: "/coding-workspace.png",
    externalResources: [
      {
        title: "MDN Web Docs - Learn Web Development",
        url: "https://developer.mozilla.org/en-US/docs/Learn",
        type: "mdn",
      },
      { title: "freeCodeCamp - Web Development", url: "https://www.freecodecamp.org/learn", type: "tutorial" },
      { title: "W3Schools - Web Tutorials", url: "https://www.w3schools.com/", type: "tutorial" },
    ],
    lessons: [
      {
        id: "lesson-2-1",
        title: "Getting Started with HTML",
        content:
          "HTML (HyperText Markup Language) is the foundation of every website.\n\nWhat you'll learn:\n- Basic HTML structure\n- Common HTML tags\n- Creating links and images\n- Building forms\n\nBy the end, you'll be able to create your first webpage.",
        duration: "30 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU",
        videoTitle: "HTML Crash Course for Beginners",
        resources: [
          {
            title: "MDN: HTML Basics",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
            type: "mdn",
          },
        ],
      },
      {
        id: "lesson-2-2",
        title: "Styling with CSS",
        content:
          "CSS (Cascading Style Sheets) makes websites beautiful.\n\nTopics covered:\n- CSS selectors and properties\n- Box model and positioning\n- Responsive design basics\n- Flexbox and Grid layouts",
        duration: "35 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
        videoTitle: "CSS Crash Course for Beginners",
        resources: [
          {
            title: "MDN: CSS Basics",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics",
            type: "mdn",
          },
        ],
      },
      {
        id: "lesson-2-3",
        title: "JavaScript Basics",
        content:
          "JavaScript brings interactivity to websites.\n\nYou'll explore:\n- Variables and data types\n- Functions and events\n- DOM manipulation\n- Basic algorithms",
        duration: "40 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
        videoTitle: "JavaScript Crash Course for Beginners",
        resources: [
          {
            title: "MDN: JavaScript Guide",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            type: "mdn",
          },
        ],
      },
      {
        id: "lesson-2-4",
        title: "Building Your First Website",
        content:
          "Put everything together and build a complete website.\n\nProject includes:\n- Planning your site structure\n- Creating multiple pages\n- Adding navigation\n- Making it mobile-friendly\n- Deploying online",
        duration: "45 min",
        order: 4,
        videoUrl: "https://www.youtube.com/embed/mU6anWqZJcc",
        videoTitle: "Build a Complete Website from Scratch",
        resources: [
          {
            title: "MDN: Publishing Your Website",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Publishing_your_website",
            type: "mdn",
          },
        ],
      },
    ],
  },
  {
    id: "course-tech-2",
    title: "Mobile App Development Basics",
    description: "Learn to build mobile apps using React Native for both Android and iOS.",
    category: "Tech",
    duration: "8 weeks",
    level: "Intermediate",
    instructor: "Samuel Bangura",
    enrolledCount: 234,
    rating: 4.6,
    thumbnail: "/coding-workspace.png",
    externalResources: [
      { title: "React Native Documentation", url: "https://reactnative.dev/docs/getting-started", type: "tutorial" },
    ],
    lessons: [
      {
        id: "lesson-tech2-1",
        title: "Introduction to React Native",
        content:
          "React Native lets you build mobile apps using JavaScript.\n\nWhat you'll learn:\n- What is React Native\n- Setting up your development environment\n- Your first app\n- Understanding components",
        duration: "35 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
        videoTitle: "React Native Tutorial for Beginners",
        resources: [],
      },
      {
        id: "lesson-tech2-2",
        title: "Building User Interfaces",
        content:
          "Create beautiful mobile interfaces.\n\nTopics:\n- Core components\n- Styling in React Native\n- Layout with Flexbox\n- Handling user input",
        duration: "40 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/obH0Po_RdWk",
        videoTitle: "React Native UI Design",
        resources: [],
      },
    ],
  },
  {
    id: "course-tech-3",
    title: "Digital Marketing Fundamentals",
    description: "Master social media marketing, SEO, and online advertising to grow businesses.",
    category: "Tech",
    duration: "4 weeks",
    level: "Beginner",
    instructor: "Fatima Sesay",
    enrolledCount: 456,
    rating: 4.8,
    thumbnail: "/coding-workspace.png",
    externalResources: [],
    lessons: [
      {
        id: "lesson-tech3-1",
        title: "Social Media Marketing",
        content:
          "Learn to use social media platforms to reach customers.\n\nTopics:\n- Facebook marketing\n- WhatsApp Business\n- Instagram for business\n- Content creation tips",
        duration: "30 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/I2pwcAVonKI",
        videoTitle: "Social Media Marketing for Beginners",
        resources: [],
      },
      {
        id: "lesson-tech3-2",
        title: "Search Engine Optimization (SEO)",
        content:
          "Get your website found on Google.\n\nLearn about:\n- How search engines work\n- Keyword research\n- On-page SEO\n- Local SEO for Sierra Leone businesses",
        duration: "35 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/DvwS7cV9GmQ",
        videoTitle: "SEO Tutorial for Beginners",
        resources: [
          {
            title: "Google SEO Starter Guide",
            url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
            type: "article",
          },
        ],
      },
    ],
  },

  // HOSPITALITY COURSES
  {
    id: "course-3",
    title: "Customer Service Excellence",
    description: "Develop professional customer service skills for hospitality and retail industries.",
    category: "Hospitality",
    duration: "3 weeks",
    level: "Beginner",
    instructor: "Fatmata Sesay",
    enrolledCount: 189,
    rating: 4.7,
    thumbnail: "/customer-service.jpg",
    externalResources: [],
    lessons: [
      {
        id: "lesson-3-1",
        title: "First Impressions Matter",
        content:
          "The first moments with a customer set the tone for the entire interaction.\n\nKey skills:\n- Professional greetings\n- Body language basics\n- Active listening\n- Reading customer needs",
        duration: "20 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/iAjmdUxDP9Y",
        videoTitle: "How to Make a Great First Impression",
        resources: [],
      },
      {
        id: "lesson-3-2",
        title: "Effective Communication",
        content:
          "Clear communication prevents misunderstandings.\n\nLearn about:\n- Speaking clearly and confidently\n- Using positive language\n- Asking the right questions\n- Explaining complex information simply",
        duration: "25 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/HAnw168huqA",
        videoTitle: "Effective Communication Skills",
        resources: [],
      },
      {
        id: "lesson-3-3",
        title: "Handling Complaints",
        content:
          "Every business faces complaints. Learn to turn unhappy customers into loyal advocates.\n\nStrategies include:\n- Staying calm under pressure\n- Empathy techniques\n- Problem-solving steps\n- When to escalate issues",
        duration: "30 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/WphIXqTp_ks",
        videoTitle: "How to Handle Customer Complaints",
        resources: [],
      },
    ],
  },
  {
    id: "course-hospitality-2",
    title: "Hotel Front Desk Operations",
    description: "Learn professional hotel front desk skills including reservations, check-in, and guest relations.",
    category: "Hospitality",
    duration: "4 weeks",
    level: "Beginner",
    instructor: "Ibrahim Conteh",
    enrolledCount: 145,
    rating: 4.5,
    thumbnail: "/customer-service.jpg",
    externalResources: [],
    lessons: [
      {
        id: "lesson-hosp2-1",
        title: "Front Desk Fundamentals",
        content:
          "Master the basics of hotel front desk operations.\n\nTopics:\n- Guest check-in procedures\n- Managing reservations\n- Handling payments\n- Room assignments",
        duration: "25 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/FpL-xDAn4Jo",
        videoTitle: "Hotel Front Desk Training",
        resources: [],
      },
      {
        id: "lesson-hosp2-2",
        title: "Guest Relations Excellence",
        content:
          "Create memorable experiences for hotel guests.\n\nLearn:\n- Anticipating guest needs\n- Handling special requests\n- Resolving issues professionally\n- Building repeat business",
        duration: "30 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/iAjmdUxDP9Y",
        videoTitle: "Guest Relations Skills Training",
        resources: [],
      },
    ],
  },

  // BUSINESS COURSES
  {
    id: "course-4",
    title: "Small Business Management",
    description: "Learn to start and manage a successful small business in Sierra Leone.",
    category: "Business",
    duration: "5 weeks",
    level: "Intermediate",
    instructor: "Mohamed Bangura",
    enrolledCount: 342,
    rating: 4.6,
    thumbnail: "/business-meeting-diversity.png",
    externalResources: [],
    lessons: [
      {
        id: "lesson-4-1",
        title: "Creating a Business Plan",
        content:
          "A solid business plan is your roadmap to success.\n\nComponents covered:\n- Executive summary\n- Market analysis\n- Financial projections\n- Marketing strategy",
        duration: "35 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/Fqch5OrUPvA",
        videoTitle: "How to Write a Business Plan Step by Step",
        resources: [],
      },
      {
        id: "lesson-4-2",
        title: "Managing Finances",
        content:
          "Good financial management keeps your business healthy.\n\nTopics include:\n- Basic accounting principles\n- Tracking income and expenses\n- Cash flow management\n- Tax obligations",
        duration: "40 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/oKZwPTOyiMM",
        videoTitle: "Small Business Accounting Basics",
        resources: [],
      },
      {
        id: "lesson-4-3",
        title: "Marketing Your Business",
        content:
          "Attract and retain customers with effective marketing.\n\nLearn about:\n- Identifying your target market\n- Social media marketing\n- Local advertising methods\n- Building customer loyalty",
        duration: "30 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/moCwdLCQPrs",
        videoTitle: "Marketing for Small Business",
        resources: [],
      },
    ],
  },
  {
    id: "course-5",
    title: "CV Writing Masterclass",
    description: "Create a professional CV that gets you noticed by employers in Sierra Leone and beyond.",
    category: "Business",
    duration: "2 weeks",
    level: "Beginner",
    instructor: "Aminata Conteh",
    enrolledCount: 892,
    rating: 4.9,
    thumbnail: "/business-meeting-diversity.png",
    externalResources: [
      {
        title: "Indeed Career Guide",
        url: "https://www.indeed.com/career-advice/resumes-cover-letters",
        type: "article",
      },
    ],
    lessons: [
      {
        id: "lesson-5-1",
        title: "CV Structure and Format",
        content:
          "Learn the essential structure of a professional CV.\n\nKey sections:\n- Contact information\n- Professional summary\n- Work experience\n- Education\n- Skills",
        duration: "25 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/Tt08KmFfIYQ",
        videoTitle: "How to Write a CV - Full Guide",
        resources: [],
      },
      {
        id: "lesson-5-2",
        title: "Writing Powerful Descriptions",
        content:
          "Transform boring job descriptions into compelling achievements.\n\nLearn to:\n- Use action verbs\n- Quantify achievements\n- Tailor to job descriptions\n- Keywords for ATS systems",
        duration: "30 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/BYUy1yvjHxE",
        videoTitle: "CV Writing Tips - Stand Out",
        resources: [],
      },
    ],
  },
  {
    id: "course-6",
    title: "Interview Skills Bootcamp",
    description: "Ace your job interviews with confidence and preparation techniques.",
    category: "Business",
    duration: "2 weeks",
    level: "Beginner",
    instructor: "David Williams",
    enrolledCount: 678,
    rating: 4.8,
    thumbnail: "/business-meeting-diversity.png",
    externalResources: [],
    lessons: [
      {
        id: "lesson-6-1",
        title: "Interview Preparation",
        content:
          "Prepare thoroughly for any job interview.\n\nLearn about:\n- Researching the company\n- Common interview questions\n- Preparing your own questions\n- What to bring",
        duration: "25 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/HG68Ymazo18",
        videoTitle: "Job Interview Tips - How to Prepare",
        resources: [],
      },
      {
        id: "lesson-6-2",
        title: "Answering Tough Questions",
        content:
          "Handle difficult interview questions with confidence.\n\nMaster:\n- STAR method for behavioral questions\n- Salary negotiation\n- Weakness questions\n- Career gap explanations",
        duration: "30 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/1mHjMNZZvFo",
        videoTitle: "Top Interview Questions and Answers",
        resources: [],
      },
      {
        id: "lesson-6-3",
        title: "Body Language and Presentation",
        content:
          "Non-verbal communication is crucial in interviews.\n\nTopics:\n- Professional dress code\n- Eye contact and posture\n- Handshake etiquette\n- Managing nervousness",
        duration: "20 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/PCWVi5pAa30",
        videoTitle: "Interview Body Language Tips",
        resources: [],
      },
    ],
  },

  // HEALTHCARE COURSES
  {
    id: "course-health-1",
    title: "Basic First Aid Training",
    description: "Essential first aid skills everyone should know to save lives in emergencies.",
    category: "Healthcare",
    duration: "2 weeks",
    level: "Beginner",
    instructor: "Dr. Amara Kargbo",
    enrolledCount: 567,
    rating: 4.9,
    thumbnail: "/customer-service.jpg",
    externalResources: [
      { title: "Red Cross First Aid", url: "https://www.redcross.org/take-a-class/first-aid", type: "article" },
    ],
    lessons: [
      {
        id: "lesson-health1-1",
        title: "Emergency Assessment",
        content:
          "Learn to quickly assess emergency situations.\n\nCover:\n- Scene safety\n- Primary assessment\n- Calling for help\n- When to act",
        duration: "20 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/ea1RJUOiNfQ",
        videoTitle: "First Aid Basics - Emergency Assessment",
        resources: [],
      },
      {
        id: "lesson-health1-2",
        title: "CPR and Choking",
        content:
          "Life-saving techniques for cardiac emergencies and choking.\n\nLearn:\n- Hands-only CPR\n- Rescue breathing\n- Heimlich maneuver\n- Child vs adult techniques",
        duration: "30 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/hizBdM1Ob68",
        videoTitle: "CPR Training - Step by Step",
        resources: [],
      },
      {
        id: "lesson-health1-3",
        title: "Wound Care and Bleeding Control",
        content:
          "Treat wounds and control bleeding effectively.\n\nTopics:\n- Cleaning wounds\n- Applying bandages\n- Stopping severe bleeding\n- When to seek medical help",
        duration: "25 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/NxO5LvgqZe0",
        videoTitle: "First Aid - Wound Care",
        resources: [],
      },
    ],
  },
  {
    id: "course-health-2",
    title: "Community Health Worker Training",
    description: "Prepare to serve your community as a frontline health worker.",
    category: "Healthcare",
    duration: "6 weeks",
    level: "Intermediate",
    instructor: "Nurse Isatu Kamara",
    enrolledCount: 234,
    rating: 4.7,
    thumbnail: "/customer-service.jpg",
    externalResources: [],
    lessons: [
      {
        id: "lesson-health2-1",
        title: "Role of Community Health Workers",
        content:
          "Understand the vital role CHWs play in Sierra Leone's healthcare system.\n\nTopics:\n- CHW responsibilities\n- Working with clinics\n- Community outreach\n- Health education",
        duration: "25 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/LIHq7t6Dq3s",
        videoTitle: "Community Health Worker Training",
        resources: [],
      },
      {
        id: "lesson-health2-2",
        title: "Maternal and Child Health",
        content:
          "Essential knowledge for supporting mothers and children.\n\nCover:\n- Prenatal care basics\n- Safe delivery signs\n- Childhood vaccinations\n- Nutrition for children",
        duration: "35 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/7Gw_rvjpf3E",
        videoTitle: "Maternal and Child Health Basics",
        resources: [],
      },
    ],
  },

  // FINANCE COURSES
  {
    id: "course-finance-1",
    title: "Personal Finance Management",
    description: "Take control of your money with budgeting, saving, and investing basics.",
    category: "Finance",
    duration: "3 weeks",
    level: "Beginner",
    instructor: "Alhaji Mansaray",
    enrolledCount: 445,
    rating: 4.6,
    thumbnail: "/business-meeting-diversity.png",
    externalResources: [],
    lessons: [
      {
        id: "lesson-fin1-1",
        title: "Budgeting Basics",
        content:
          "Create a budget that actually works.\n\nLearn:\n- Tracking income and expenses\n- The 50/30/20 rule\n- Budgeting apps and tools\n- Cutting unnecessary expenses",
        duration: "25 min",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/HQzoZfc3GwQ",
        videoTitle: "How to Budget for Beginners",
        resources: [],
      },
      {
        id: "lesson-fin1-2",
        title: "Saving and Emergency Funds",
        content:
          "Build financial security through saving.\n\nTopics:\n- Why save money\n- Emergency fund basics\n- Saving strategies\n- Where to keep savings",
        duration: "20 min",
        order: 2,
        videoUrl: "https://www.youtube.com/embed/b-K_dKrT2SQ",
        videoTitle: "How to Save Money",
        resources: [],
      },
      {
        id: "lesson-fin1-3",
        title: "Mobile Money Management",
        content:
          "Use Orange Money and Afrimoney effectively.\n\nLearn:\n- Setting up accounts\n- Safe transactions\n- Avoiding scams\n- Business use cases",
        duration: "25 min",
        order: 3,
        videoUrl: "https://www.youtube.com/embed/L8xvP3ZIMKE",
        videoTitle: "Mobile Money Tips",
        resources: [],
      },
    ],
  },
]

export const courses = mockCourses
