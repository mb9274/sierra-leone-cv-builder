import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return NextResponse.json(data, { status })
  }

  static error(message: string, status = 500, code?: string, details?: any) {
    const error: ApiError = { message }
    if (code) error.code = code
    if (details) error.details = details

    return NextResponse.json({ error }, { status })
  }

  static validationError(issues: any[]) {
    return this.error("Validation failed", 400, "VALIDATION_ERROR", { issues })
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401, "UNAUTHORIZED")
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403, "FORBIDDEN")
  }

  static notFound(message = "Not found") {
    return this.error(message, 404, "NOT_FOUND")
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return ApiResponse.validationError(error.issues)
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("Unauthorized")) {
      return ApiResponse.unauthorized()
    }
    if (error.message.includes("Not found")) {
      return ApiResponse.notFound()
    }
    return ApiResponse.error(error.message, 500)
  }

  return ApiResponse.error("An unexpected error occurred", 500)
}

export async function withAuth<T>(
  handler: (user: any) => Promise<NextResponse>,
  createClient: () => Promise<any>
): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return ApiResponse.unauthorized()
    }

    return await handler(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function parseJsonBody<T>(request: Request, schema?: any): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json()

    if (schema) {
      const parsed = schema.safeParse(body)
      if (!parsed.success) {
        return { success: false, response: ApiResponse.validationError(parsed.error.issues) }
      }
      return { success: true, data: parsed.data as T }
    }

    return { success: true, data: body as T }
  } catch {
    return { success: false, response: ApiResponse.error("Invalid JSON", 400) }
  }
}