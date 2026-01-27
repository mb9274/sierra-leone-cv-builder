"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, Sparkles, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickQuestion {
  category: string
  question: string
}

const quickQuestions: QuickQuestion[] = [
  // Agriculture
  { category: "Agriculture", question: "How do I test my soil pH?" },
  { category: "Agriculture", question: "What crops grow best in Sierra Leone?" },
  { category: "Agriculture", question: "How do I prevent soil erosion?" },
  { category: "Agriculture", question: "What's the best way to start poultry farming?" },

  // Technology
  { category: "Tech", question: "How do I create my first website?" },
  { category: "Tech", question: "What programming language should I learn first?" },
  { category: "Tech", question: "How does SEO work?" },
  { category: "Tech", question: "What is digital marketing?" },

  // Hospitality
  { category: "Hospitality", question: "How do I handle difficult customers?" },
  { category: "Hospitality", question: "What are the basics of hotel management?" },
  { category: "Hospitality", question: "How do I improve customer service skills?" },

  // Business
  { category: "Business", question: "How do I write a business plan?" },
  { category: "Business", question: "What makes a good CV?" },
  { category: "Business", question: "How do I market my small business?" },
  { category: "Business", question: "How do I manage business finances?" },

  // Healthcare
  { category: "Healthcare", question: "What are the steps in CPR?" },
  { category: "Healthcare", question: "How do I treat a wound?" },
  { category: "Healthcare", question: "What's the role of a community health worker?" },

  // Finance
  { category: "Finance", question: "How do I create a budget?" },
  { category: "Finance", question: "What's the 50/30/20 budgeting rule?" },
  { category: "Finance", question: "How do I use mobile money safely?" },
  { category: "Finance", question: "How do I build an emergency fund?" },
]

const aiResponses: Record<string, string> = {
  // Agriculture responses
  "how do i test my soil ph":
    "To test your soil pH:\n\n1. **Get a pH Test Kit** - Available at agricultural stores in Freetown, Bo, or Makeni for around 20,000 Leones\n\n2. **Collect Soil Samples** - Take samples from 3-5 different spots in your farm, about 6 inches deep\n\n3. **Mix and Test** - Combine the samples, add distilled water, and use the test strips\n\n4. **Read Results** - Most crops prefer pH 6-7. If too acidic (below 6), add lime. If too alkaline (above 7), add sulfur\n\n💡 Tip: Test your soil at the start of each planting season for best results!",

  "what crops grow best in sierra leone":
    "Best crops for Sierra Leone:\n\n**Rainy Season (May-October):**\n• Rice (main staple crop)\n• Cassava\n• Sweet potatoes\n• Groundnuts\n• Vegetables (tomatoes, peppers, okra)\n\n**Dry Season (November-April):**\n• Maize\n• Beans\n• Onions\n• Watermelons\n\n**Year-round:**\n• Bananas and plantains\n• Pineapples\n• Mangoes\n\n💰 High-profit crops: Vegetables, groundnuts, and rice are most profitable in local markets.",

  "how do i prevent soil erosion":
    "Prevent soil erosion with these techniques:\n\n1. **Contour Farming** - Plant across slopes, not up and down\n\n2. **Cover Crops** - Plant legumes or grasses between main crops\n\n3. **Mulching** - Cover soil with plant material to protect from rain\n\n4. **Terracing** - Create flat areas on hillsides\n\n5. **Plant Trees** - Create windbreaks and hold soil with roots\n\n6. **Avoid Over-tilling** - Only till when necessary\n\n✅ These methods work especially well during Sierra Leone's heavy rainy season!",

  "what's the best way to start poultry farming":
    "Starting poultry farming in Sierra Leone:\n\n**Initial Investment: 2-5 million Leones**\n\n1. **Choose Your Focus**\n   - Layers (eggs): More steady income\n   - Broilers (meat): Faster returns (6-8 weeks)\n\n2. **Build Housing**\n   - 50 birds need 100 sq ft minimum\n   - Good ventilation crucial\n   - Protect from predators\n\n3. **Buy Starter Chicks**\n   - Local breeds: More disease-resistant\n   - Imported breeds: Faster growth\n\n4. **Feed and Care**\n   - Budget 200-300 Leones per bird daily\n   - Clean water always available\n   - Vaccinate according to schedule\n\n💡 Start with 50-100 birds and scale up!",

  // Technology responses
  "how do i create my first website":
    "Create your first website in 5 steps:\n\n1. **Learn HTML & CSS** (Start with our Web Development course!)\n   - HTML structures your content\n   - CSS makes it look beautiful\n\n2. **Choose a Text Editor**\n   - VS Code (free)\n   - Notepad++ (free)\n\n3. **Create Your First Page**\n   ```html\n   <!DOCTYPE html>\n   <html>\n   <body>\n     <h1>My First Website</h1>\n     <p>Welcome to my site!</p>\n   </body>\n   </html>\n   ```\n\n4. **Save as index.html**\n\n5. **Open in Browser** - Double-click the file!\n\n📚 Complete our Web Development course for full tutorials with videos!",

  "what programming language should i learn first":
    "Best first programming languages:\n\n**🏆 Recommended: Python**\n- Easy to learn\n- Used everywhere (web, AI, data)\n- Great job opportunities\n\n**Also Good:**\n\n1. **JavaScript** - For web development, works in browsers\n\n2. **HTML/CSS** - Not programming languages but essential for websites\n\n3. **Java** - Used in Android apps and enterprise\n\n💼 **For Jobs in Sierra Leone:**\nLearn Python + JavaScript. Most Sierra Leone tech companies need web developers!\n\n📺 Check our Digital Literacy and Web Development courses!",

  "how does seo work":
    'SEO (Search Engine Optimization) explained:\n\n**What is SEO?**\nGetting your website to appear on Google search results\n\n**How it Works:**\n\n1. **Keywords** - Words people search for\n   - Example: "best hotel in Freetown"\n   - Use these words on your website\n\n2. **Quality Content** - Write helpful articles\n\n3. **Mobile-Friendly** - Works on phones (important in Sierra Leone!)\n\n4. **Fast Loading** - Quick websites rank better\n\n5. **Backlinks** - Other websites linking to yours\n\n🎯 **For Sierra Leone Businesses:**\n- Include location in titles: "Freetown", "Bo", "Makeni"\n- Register on Google My Business (free!)\n- Use local keywords\n\n📚 Take our Digital Marketing course for full SEO training!',

  "what is digital marketing":
    "Digital Marketing explained:\n\n**Definition:** Promoting your business online\n\n**Main Channels:**\n\n1. **Social Media** (Most important in Sierra Leone!)\n   - Facebook: Largest audience\n   - WhatsApp Business: Direct customer contact\n   - Instagram: Great for products\n   - TikTok: Growing fast with youth\n\n2. **Search Engines** (Google)\n   - SEO: Free organic traffic\n   - Google Ads: Paid advertising\n\n3. **Email Marketing**\n   - Build customer lists\n   - Send promotions\n\n4. **Content Marketing**\n   - Blog posts, videos\n   - Educate customers\n\n💰 **Cost:** Start with FREE social media marketing!\n\n📱 In Sierra Leone, focus on Facebook and WhatsApp - that's where your customers are!",

  // Hospitality responses
  "how do i handle difficult customers":
    'Handling difficult customers - The LAST Method:\n\n**L - Listen**\n- Let them express frustration\n- Don\'t interrupt\n- Show you\'re paying attention\n\n**A - Apologize**\n- "I\'m sorry you\'re experiencing this"\n- Doesn\'t admit fault, shows empathy\n\n**S - Solve**\n- Ask: "What can I do to make this right?"\n- Offer solutions\n- Be specific\n\n**T - Thank**\n- "Thank you for bringing this to our attention"\n- "We appreciate your patience"\n\n**✨ Sierra Leone Tip:**\nCustomers appreciate when you acknowledge them personally. Use "Sir" or "Madam" and maintain eye contact.\n\n🎓 Our Customer Service Excellence course covers this in detail!',

  "what are the basics of hotel management":
    "Hotel Management basics:\n\n**5 Key Areas:**\n\n1. **Front Desk Operations**\n   - Check-in/check-out\n   - Reservations\n   - Customer service\n\n2. **Housekeeping**\n   - Room cleaning standards\n   - Inventory management\n   - Quality control\n\n3. **Food & Beverage**\n   - Restaurant service\n   - Bar management\n   - Kitchen operations\n\n4. **Maintenance**\n   - Building upkeep\n   - Safety standards\n   - Equipment repair\n\n5. **Accounting**\n   - Revenue management\n   - Cost control\n   - Payroll\n\n**🏨 In Sierra Leone:**\nMajor opportunities in Freetown (tourist area), Bo, and Makeni. Starting salary: 1.5-3 million Leones/month for managers.\n\n📚 Take our Hotel Management course for complete training!",

  "how do i improve customer service skills":
    "Improve customer service skills:\n\n**1. Master Communication**\n- Speak clearly\n- Use positive language\n- Smile (customers can hear it on phone!)\n\n**2. Practice Active Listening**\n- Pay full attention\n- Ask clarifying questions\n- Repeat back to confirm\n\n**3. Develop Product Knowledge**\n- Know what you're selling\n- Understand features and benefits\n- Stay updated on changes\n\n**4. Manage Emotions**\n- Stay calm under pressure\n- Don't take complaints personally\n- Take deep breaths\n\n**5. Follow Up**\n- Check if problem was solved\n- Thank customers for their business\n\n💼 **For Sierra Leone Jobs:**\nExcellent customer service skills can land you jobs at banks, telecoms (Africell, Orange), hotels, and restaurants!\n\n🎓 Our Customer Service Excellence course provides hands-on practice!",

  // Business responses
  "how do i write a business plan":
    "Write a business plan in 7 sections:\n\n**1. Executive Summary**\n- Business name and concept\n- What problem you solve\n- Target customers\n\n**2. Business Description**\n- What you sell/service\n- Location\n- Legal structure\n\n**3. Market Analysis**\n- Who are your customers?\n- Who are competitors?\n- Market size in Sierra Leone\n\n**4. Organization**\n- Your team\n- Roles and responsibilities\n\n**5. Products/Services**\n- Detailed description\n- Pricing\n- Unique selling points\n\n**6. Marketing Plan**\n- How you'll reach customers\n- Social media, word-of-mouth, etc.\n\n**7. Financial Projections**\n- Startup costs\n- Monthly expenses\n- Revenue forecast\n\n💡 **Sierra Leone Tip:** Keep it simple! Banks and investors want to see clear numbers and realistic goals.\n\n📚 Our Entrepreneurship Fundamentals course includes a business plan template!",

  "what makes a good cv":
    "Elements of a GREAT CV:\n\n**✅ Must-Haves:**\n\n1. **Contact Information**\n   - Full name\n   - Phone: +232 format\n   - Professional email\n   - Location (city in Sierra Leone)\n\n2. **Professional Summary**\n   - 2-3 sentences\n   - Your skills and experience\n   - What you're looking for\n\n3. **Work Experience**\n   - Most recent first\n   - Company, role, dates\n   - Bullet points of achievements\n   - Use action verbs (managed, developed, led)\n\n4. **Education**\n   - Degree/diploma\n   - Institution\n   - Year graduated\n\n5. **Skills**\n   - Technical skills\n   - Soft skills\n   - Languages\n\n**❌ Avoid:**\n- Photos (unless requested)\n- Personal details (age, marital status)\n- Typos and errors\n- Lies\n\n**📄 Length:** 1-2 pages maximum\n\n🎯 Use our Konek Salone tool to create a professional CV in minutes!",

  "how do i market my small business":
    "Market your Sierra Leone small business:\n\n**FREE Methods:**\n\n1. **Social Media Marketing**\n   - Create Facebook Business Page\n   - Post daily (products, behind-scenes, tips)\n   - Use WhatsApp Business for orders\n   - Join local Facebook groups\n\n2. **Word of Mouth**\n   - Ask happy customers to refer friends\n   - Offer referral discounts\n\n3. **Google My Business**\n   - Free listing\n   - Appears on Google Maps\n   - Customers can review you\n\n**Low-Cost Methods:**\n\n4. **Flyers and Posters**\n   - Print at cyber cafes (cheap!)\n   - Post in busy areas\n\n5. **Community Events**\n   - Sponsor local events\n   - Set up booths at markets\n\n6. **SMS Marketing**\n   - Collect customer numbers\n   - Send weekly offers\n\n💰 Start with #1 and #2 - they're completely free!\n\n📱 In Sierra Leone, WhatsApp is king for business!",

  "how do i manage business finances":
    "Manage small business finances:\n\n**1. Separate Business and Personal**\n- Open business bank account\n- Don't mix money!\n\n**2. Track Everything**\n- Record every sale (use notebook or phone)\n- Record every expense\n- Do this DAILY\n\n**3. Basic Formula:**\nProfit = Revenue - Expenses\n- Revenue: Money coming in\n- Expenses: Money going out\n- Profit: What you keep\n\n**4. Cash Flow Management**\n- Always keep emergency cash\n- Don't spend all profits immediately\n- Save 20% for slow periods\n\n**5. Pay Yourself**\n- Set a salary\n- Don't just take money randomly\n\n**6. Plan for Taxes**\n- Set aside money for NRA\n- Keep receipts\n\n📱 **Tools:**\n- Paper ledger: 5,000 Leones\n- Mobile apps: Free (Wave, QuickBooks)\n- Excel: If you have computer\n\n💼 Our Entrepreneurship course includes financial management training!",

  // Healthcare responses
  "what are the steps in cpr":
    'CPR (Cardiopulmonary Resuscitation) Steps:\n\n**⚠️ EMERGENCY ONLY - Call 999 first!**\n\n**C-A-B Method:**\n\n**C - Compressions (30 times)**\n1. Place heel of hand on center of chest\n2. Other hand on top, fingers interlaced\n3. Press down 2 inches (5cm)\n4. Push HARD and FAST (100-120 per minute)\n5. Let chest rise fully between compressions\n6. Count out loud: 1, 2, 3... 30\n\n**A - Airway**\n- Tilt head back gently\n- Lift chin up\n\n**B - Breathing (2 breaths)**\n- Pinch nose shut\n- Cover mouth with yours\n- Give 2 breaths (1 second each)\n- Watch chest rise\n\n**Repeat C-A-B until:**\n- Help arrives\n- Person starts breathing\n- You\'re too exhausted\n\n🎵 **Rhythm Tip:** Do compressions to the beat of "Staying Alive" by Bee Gees!\n\n⚕️ Our First Aid & Emergency Response course includes video demonstrations!',

  "how do i treat a wound":
    "Wound Treatment Steps:\n\n**1. Safety First**\n- Wash YOUR hands with soap\n- Wear gloves if available\n\n**2. Stop Bleeding**\n- Apply direct pressure with clean cloth\n- Hold for 5-10 minutes\n- Don't keep checking!\n\n**3. Clean the Wound**\n- Rinse with clean water\n- Use soap around (not in) wound\n- Remove visible dirt gently\n\n**4. Apply Antibiotic**\n- Betadine or Dettol (available in SL)\n- Thin layer\n\n**5. Cover with Bandage**\n- Keep wound covered\n- Change bandage daily\n- Keep dry\n\n**🏥 Seek Medical Help If:**\n- Deep wound (can see fat/muscle)\n- Won't stop bleeding\n- Caused by dirty/rusty object\n- Signs of infection (pus, red streaks, fever)\n- Animal or human bite\n\n**🇸🇱 Sierra Leone Resources:**\n- Connaught Hospital (Freetown): 022-222-861\n- Bo Government Hospital: 032-270-005\n\n⚕️ Take our First Aid course for hands-on training!",

  "what's the role of a community health worker":
    "Community Health Worker (CHW) Role:\n\n**Main Responsibilities:**\n\n1. **Health Education**\n   - Teach disease prevention\n   - Promote hygiene\n   - Nutrition counseling\n\n2. **Disease Detection**\n   - Identify sick people early\n   - Refer to clinics\n   - Follow up on treatments\n\n3. **Maternal & Child Health**\n   - Prenatal care education\n   - Safe delivery practices\n   - Child vaccination tracking\n\n4. **Community Mobilization**\n   - Organize health campaigns\n   - Lead community meetings\n   - Connect people to services\n\n5. **Data Collection**\n   - Record health information\n   - Report to health facilities\n   - Track disease outbreaks\n\n**🇸🇱 In Sierra Leone:**\n- Crucial after Ebola\n- Work with chiefdoms and districts\n- Bridge between communities and clinics\n\n**💰 Compensation:**\n- Stipends vary by NGO/government\n- Typically 300,000-800,000 Leones/month\n- Plus transport and supplies\n\n📚 Our Community Health Worker Training course provides certification preparation!",

  // Finance responses
  "how do i create a budget":
    "Create a Simple Budget:\n\n**Step 1: Calculate Monthly Income**\n- Salary\n- Business income\n- Other sources\n- Total: __________ Leones\n\n**Step 2: List All Expenses**\n\n**Fixed (Same each month):**\n- Rent\n- School fees\n- Transport\n- Phone credit\n\n**Variable (Changes):**\n- Food\n- Electricity\n- Entertainment\n- Emergencies\n\n**Step 3: Use 50/30/20 Rule**\n- 50% Needs (rent, food, transport)\n- 30% Wants (entertainment, nice clothes)\n- 20% Savings\n\n**Step 4: Track Daily**\n- Write down EVERYTHING you spend\n- Use notebook or phone notes\n- Review weekly\n\n**💡 Sierra Leone Example:**\nIncome: 2,000,000 Leones/month\n- Needs: 1,000,000 (rent 400k, food 400k, transport 200k)\n- Wants: 600,000 (entertainment, clothes)\n- Savings: 400,000\n\n📱 Free budgeting apps work on basic phones too!\n\n📚 Our Personal Finance Management course includes budget templates!",

  "what's the 50/30/20 budgeting rule":
    "The 50/30/20 Budgeting Rule:\n\n**Simple Formula for Your Income:**\n\n**50% - NEEDS (Must-Haves)**\n- Rent/housing\n- Food and groceries\n- Transportation\n- Utilities (electricity, water)\n- Minimum debt payments\n- Basic clothing\n\n**30% - WANTS (Nice-to-Haves)**\n- Dining out\n- Entertainment\n- Hobbies\n- Cable TV/streaming\n- Nice clothes (beyond basics)\n- Vacations\n\n**20% - SAVINGS & DEBT**\n- Emergency fund\n- Savings accounts\n- Investments\n- Extra debt payments\n- Future goals\n\n**📊 Sierra Leone Example:**\n\nIf you earn 3,000,000 Leones/month:\n- 1,500,000 for Needs\n- 900,000 for Wants\n- 600,000 for Savings\n\n**⚠️ Adjust if Needed:**\n- If rent is very high, try 60/20/20\n- If low expenses, try 50/20/30 (save more!)\n\n💡 The key: SAVE SOMETHING every month!\n\n📚 Our Personal Finance course helps you customize this for your situation!",

  "how do i use mobile money safely":
    'Mobile Money Safety Tips:\n\n**🔒 Security Basics:**\n\n1. **PIN Protection**\n   - Never share your PIN\n   - Don\'t write it down\n   - Change it regularly\n   - Don\'t use obvious numbers (1234, birth year)\n\n2. **Verify Before Sending**\n   - Check recipient number TWICE\n   - Confirm name on screen\n   - Mobile money can\'t be reversed!\n\n3. **Beware of Scams**\n   - Orange/Afrimoney will NEVER call asking for PIN\n   - Don\'t send money to "verify" winnings\n   - Ignore "urgent family emergency" messages\n\n**🇸🇱 Common Sierra Leone Scams:**\n\n❌ "Send money to claim lottery prize"\n❌ "Your account will be blocked, send PIN to verify"\n❌ "Emergency, relative needs money NOW"\n\n**✅ Safe Practices:**\n\n- Only use official agents\n- Keep transaction receipts\n- Check balance regularly\n- Report suspicious activity immediately\n\n**📱 Provider Numbers:**\n- Orange Money: 155\n- Afrimoney: 141\n\n💰 Our Personal Finance course includes mobile money best practices!',

  "how do i build an emergency fund":
    'Build an Emergency Fund:\n\n**What is it?**\nMoney saved ONLY for true emergencies (job loss, medical, urgent repairs)\n\n**How Much to Save:**\n\n**Beginner Goal:** 100,000-200,000 Leones\n**Intermediate:** 3 months of expenses\n**Advanced:** 6 months of expenses\n\n**Step-by-Step Plan:**\n\n**1. Start Small**\n- Save 10,000 Leones this week\n- Then 10,000 every week\n- Builds momentum!\n\n**2. Automate It**\n- Set up automatic transfer on payday\n- Treat it like a bill\n- "Pay yourself first"\n\n**3. Where to Keep It**\n- Separate savings account\n- Mobile money wallet (but different SIM!)\n- NOT in your pocket!\n\n**4. Don\'t Touch It**\n- Only for TRUE emergencies\n- Not for wants (new phone, party)\n- Rebuild after using it\n\n**💡 Quick Saving Tricks:**\n- Save every 5,000 Leones note you get\n- Cut one unnecessary expense\n- Save half of any bonuses/gifts\n\n**🇸🇱 Sierra Leone Example:**\nMonthly expenses: 1,500,000 Leones\n× 3 months = 4,500,000 Leones target\n\nSeem impossible? Start with 100,000 and build up!\n\n📚 Our Personal Finance course includes detailed saving strategies!',
}

function getAIResponse(question: string): string {
  const normalizedQuestion = question.toLowerCase().trim()

  // Try to find exact or partial match
  for (const [key, response] of Object.entries(aiResponses)) {
    if (normalizedQuestion.includes(key) || key.includes(normalizedQuestion)) {
      return response
    }
  }

  // Default response with helpful suggestions
  return `I don't have a specific answer for that question yet, but I can help you with:\n\n📚 **Available Topics:**\n\n🌾 **Agriculture** - Farming, poultry, soil management\n💻 **Technology** - Web development, programming, digital marketing\n🏨 **Hospitality** - Customer service, hotel management\n💼 **Business** - CV writing, entrepreneurship, marketing\n🏥 **Healthcare** - First aid, community health\n💰 **Finance** - Budgeting, saving, mobile money\n\n💡 **Try asking:**\n- "How do I test my soil pH?"\n- "What programming language should I learn?"\n- "How do I write a business plan?"\n- "What are the steps in CPR?"\n\nOr select a question from the categories above!`
}

export function LearningAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm your Learning Assistant. I can answer questions about:\n\n🌾 Agriculture\n💻 Technology\n🏨 Hospitality\n💼 Business\n🏥 Healthcare\n💰 Finance\n\nPick a topic below or ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["Agriculture", "Tech", "Hospitality", "Business", "Healthcare", "Finance"]

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || input
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Get AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 500)

    setInput("")
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const filteredQuestions = selectedCategory
    ? quickQuestions.filter((q) => q.category === selectedCategory)
    : quickQuestions

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-[#4CAF50] to-[#45a049] hover:scale-110 transition-transform z-50"
        >
          <Bot className="size-8 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-2 border-[#4CAF50]/30">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Learning Assistant</CardTitle>
                  <CardDescription className="text-white/80 text-xs">Ask me about your courses</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Category Filter */}
          <div className="p-3 border-b bg-muted/30">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                size="sm"
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#4CAF50]" : ""}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-[#4CAF50] whitespace-nowrap" : "whitespace-nowrap"}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-3 border-b bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              Quick Questions:
            </p>
            <ScrollArea className="h-20">
              <div className="flex flex-wrap gap-2">
                {filteredQuestions.slice(0, 8).map((q, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickQuestion(q.question)}
                    className="text-xs h-7"
                  >
                    {q.question}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-[#4CAF50] text-white" : "bg-muted text-foreground"
                      }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="size-4" />
                        <span className="text-xs font-medium">Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                className="bg-[#4CAF50] hover:bg-[#45a049]"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
