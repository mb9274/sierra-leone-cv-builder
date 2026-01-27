import type { PremiumProduct } from "./types"

export const premiumProducts: PremiumProduct[] = [
  {
    id: "premium-template",
    name: "Premium CV Template",
    description: "Get access to professionally designed CV templates that stand out to employers",
    priceSLL: 10,
    priceSOL: 0.01,
    type: "premium_template",
    features: ["5 Premium Templates", "Modern Designs", "ATS-Friendly Formats", "Lifetime Access"],
  },
  {
    id: "cv-verification",
    name: "CV Verification",
    description: "Verify your CV on the blockchain for authenticity and trust",
    priceSLL: 5,
    priceSOL: 0.005,
    type: "cv_verification",
    features: ["Blockchain Verification", "Unique Verification ID", "Tamper-Proof Record", "Employer Trust Badge"],
  },
  {
    id: "ai-rewrite",
    name: "Pro AI Rewrite",
    description: "Get your entire CV professionally rewritten by advanced AI",
    priceSLL: 7,
    priceSOL: 0.007,
    type: "ai_rewrite",
    features: ["Complete CV Rewrite", "Professional Language", "Industry-Specific Keywords", "ATS Optimization"],
  },
  {
    id: "interview-prep-pro",
    name: "Interview Prep Pro",
    description: "Get personalized interview coaching and practice questions",
    priceSLL: 8,
    priceSOL: 0.008,
    type: "interview_prep",
    features: ["50+ Practice Questions", "Video Interview Tips", "Company-Specific Prep", "Follow-up Email Templates"],
  },
]
