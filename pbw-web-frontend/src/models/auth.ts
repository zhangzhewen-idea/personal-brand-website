export interface LoginPayload {
  account: string
  password: string
}

export interface RegisterPayload {
  nickname: string
  account: string
  email: string
  password: string
}

export interface RegisterForm extends RegisterPayload {
  confirmPassword: string
}
