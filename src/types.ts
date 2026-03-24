export interface CVData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  skills: string[]
  education: string[]
  experience: string[]
}

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; message: string }
  | { status: "success"; message: string; filePath?: string }
  | { status: "error"; message: string }
