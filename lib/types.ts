export interface CVData {
  id: string
  verificationId?: string
  verifiedAt?: string
  templateId?: string // Added template selection support
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    age?: number // Added age field for 18-30 demographic
    profilePhoto?: string // Added profile photo URL
    summary: string
  }
  education: Array<{
    id: string
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    current: boolean
  }>
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  skills: string[]
  languages: Array<{
    language: string
    proficiency: string
  }>
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  matchScore: number
  postedDate: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface User {
  id: string
  email: string
  fullName: string
  cvs: CVData[]
  createdAt: Date
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: "SLL" | "SOL"
  method: "orange_money" | "afrimoney" | "solana_pay"
  status: "pending" | "completed" | "failed"
  productType: "premium_template" | "cv_verification" | "ai_rewrite" | "interview_prep"
  productName: string
  transactionId?: string
  phoneNumber?: string
  walletAddress?: string
  createdAt: Date
  completedAt?: Date
}

export interface PremiumProduct {
  id: string
  name: string
  description: string
  priceSLL: number
  priceSOL: number
  type: "premium_template" | "cv_verification" | "ai_rewrite" | "interview_prep"
  features: string[]
}

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  company: string
  applicantInfo: {
    fullName: string
    email: string
    phone: string
    location: string
  }
  coverLetter: string
  cvAttached: boolean
  cvId?: string
  expectedSalary: string
  availableStartDate: string
  status: "submitted" | "under_review" | "interviewed" | "accepted" | "rejected"
  appliedAt: Date
  portfolio?: string
  linkedIn?: string
  references: Array<{
    name: string
    position: string
    company: string
    email: string
    phone: string
  }>
}

export interface JobLocation {
  id: string
  jobId: string
  latitude: number
  longitude: number
  address: string
  district: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: "Agriculture" | "Tech" | "Hospitality" | "Business" | "Healthcare" | "Finance"
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  lessons: Array<{
    id: string
    title: string
    content: string
    duration: string
    order: number
    videoUrl?: string
    videoTitle?: string
    resources?: Array<{
      title: string
      url: string
      type: "mdn" | "youtube" | "article" | "pdf" | "tutorial"
    }>
  }>
  instructor: string
  enrolledCount: number
  rating: number
  thumbnail: string
  externalResources?: Array<{
    title: string
    url: string
    type: "mdn" | "youtube" | "article" | "pdf" | "tutorial"
  }>
}

export interface CourseProgress {
  userId: string
  courseId: string
  completedLessons: string[]
  lastAccessedAt: Date
  completed: boolean
  completedAt?: Date
}

export interface CommunityService {
  id: string
  name: string
  category: "Water Access" | "Electricity" | "Waste Disposal" | "Local Events" | "Youth Support"
  description: string
  location: string
  contact: string
  hours: string
  icon: string
}

export interface HealthService {
  id: string
  name: string
  type: "clinic" | "hospital" | "vaccination_center" | "maternal_health"
  location: string
  address: string
  phone: string
  emergencyAvailable: boolean
  services: string[]
  hours: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface BusinessSupportService {
  id: string
  title: string
  category: "registration" | "loans" | "market_access" | "marketing" | "training"
  description: string
  eligibility: string[]
  howToApply: string
  contact: string
}

export interface SafetyAlert {
  id: string
  type: "emergency" | "incident" | "safe_location" | "community_watch"
  title: string
  description: string
  location: string
  reportedAt: Date
  status: "active" | "resolved"
}

export interface GovernmentService {
  id: string
  name: string
  category: "passport" | "national_id" | "birth_certificate" | "business_license" | "address_verification"
  description: string
  requirements: string[]
  fee: string
  processingTime: string
  location: string
  contact: string
}

export interface FinanceTransaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer" | "bill_payment"
  amount: number
  currency: "SLL" | "SOL"
  status: "pending" | "completed" | "failed"
  description: string
  date: Date
  method: "orange_money" | "afrimoney" | "solana_pay"
}

export interface Wallet {
  balance: number
  currency: "SLL" | "SOL"
  transactions: FinanceTransaction[]
}
