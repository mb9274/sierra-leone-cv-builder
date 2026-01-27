import { CVData } from "@/lib/types"

export interface CVLayoutProps {
    cvData: CVData
    theme: any
    isEditing?: boolean
    editedData?: CVData | null
    onEdit?: (data: CVData) => void
}
