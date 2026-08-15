export interface RoleSummary {
  id: number
  name: string
  description: string | null
  isActive: boolean
}

export interface CurrentUser {
  id: number
  fullName: string
  email: string
  status: string
  role: RoleSummary
}

export interface LoginResponse {
  accessToken: string
  user: CurrentUser
}

export interface ApiErrorBody {
  message?: string | string[]
}
