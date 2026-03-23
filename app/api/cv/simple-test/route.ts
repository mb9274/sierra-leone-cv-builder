import { NextRequest, NextResponse } from "next/server"
import { CVData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, skills } = body

    if (!fullName || !email || !skills) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simple test CV without complex functions
    const testCV: Omit<CVData, 'id' | 'createdAt' | 'updatedAt'> = {
      personalInfo: {
        fullName: fullName,
        email: email,
        phone: "+232-76-123-456",
        location: "Freetown, Sierra Leone",
        summary: `Professional ${skills.split(',')[0].trim()} specialist with expertise in ${skills}`,
        age: "25-30",
        linkedin: `linkedin.com/in/${fullName.toLowerCase().replace(/\s+/g, '.')}`,
        portfolio: "github.com/" + fullName.toLowerCase().replace(/\s+/g, '')
      },
      education: [
        {
          id: "edu-1",
          institution: "Fourah Bay College, University of Sierra Leone",
          degree: "Bachelor of Science (B.Sc.)",
          fieldOfStudy: "Computer Science",
          startDate: "2018",
          endDate: "2022",
          current: false
        }
      ],
      experience: [
        {
          id: "exp-1",
          company: "Sierra Leone Telecom",
          position: "Software Developer",
          location: "Freetown, Sierra Leone",
          startDate: "2022",
          endDate: "Present",
          current: true,
          description: "• Developed web applications using modern technologies\n• Collaborated with cross-functional teams\n• Implemented responsive designs and user interfaces",
          achievements: "Successfully delivered 5+ projects on time and within budget"
        }
      ],
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      languages: [
        { language: "English", proficiency: "Fluent" },
        { language: "Krio", proficiency: "Native" }
      ],
      projects: [
        {
          id: "proj-1",
          name: "Web Application Development",
          description: "Developed a responsive web application for client management",
          technologies: ["JavaScript", "React", "CSS"],
          outcome: "Increased client satisfaction by 40%"
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Web Development Certification",
          organization: "Tech Institute",
          year: "2023"
        }
      ],
      volunteering: [
        {
          id: "vol-1",
          organization: "Sierra Leone Red Cross Society",
          role: "Community Volunteer",
          startDate: "2020",
          endDate: "Present",
          description: "Community service and disaster relief efforts"
        }
      ],
      awards: [
        {
          id: "award-1",
          name: "Best Performance Award",
          organization: "Fourah Bay College",
          year: "2022",
          reason: "Academic excellence"
        }
      ],
      hobbies: [
        "Reading technology blogs",
        "Community service",
        "Web development"
      ],
      referees: [
        {
          id: "ref-1",
          name: "Dr. James Conteh",
          title: "Head of Department",
          organization: "Fourah Bay College",
          phone: "+232-76-555-1234",
          email: "j.conteh@fbc.edu.sl",
          availableOnRequest: true
        }
      ]
    }

    return NextResponse.json({ 
      success: true, 
      message: "Simple test CV generated successfully",
      data: {
        ...testCV,
        id: `simple-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  } catch (error) {
    console.error("Simple test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Simple test CV endpoint" })
}
