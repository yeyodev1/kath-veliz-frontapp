import APIBase from './httpBase'
import type { SessionUser } from '@/types'

export interface AuthSession {
  token: string
  user: SessionUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

export interface ProfilePayload {
  name: string
  phone: string
  documentId: string
}

/**
 * El contrato dice que /auth/me devuelve el usuario "desnudo"; el backapp del
 * scaffold lo envolvía en { user }. Se aceptan las dos formas.
 */
function unwrapUser(data: SessionUser | { user: SessionUser }): SessionUser {
  return 'user' in data && data.user ? data.user : (data as SessionUser)
}

class AuthService extends APIBase {
  async login(email: string, password: string): Promise<AuthSession> {
    const { data } = await this.post<AuthSession>('auth/login', { email, password })
    return data
  }

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const { data } = await this.post<AuthSession>('auth/register', payload)
    return data
  }

  async me(): Promise<SessionUser> {
    const { data } = await this.get<SessionUser | { user: SessionUser }>('auth/me')
    return unwrapUser(data)
  }

  async updateProfile(payload: ProfilePayload): Promise<SessionUser> {
    const { data } = await this.put<SessionUser | { user: SessionUser }>('auth/me', payload)
    return unwrapUser(data)
  }

  async changePassword(current: string, next: string): Promise<void> {
    await this.put<unknown>('auth/password', { current, next })
  }

  /** Siempre responde ok: no revela si el correo existe. */
  async forgotPassword(email: string): Promise<void> {
    await this.post<{ ok: boolean }>('auth/forgot-password', { email })
  }

  /** Sirve igual para "olvidé mi contraseña" que para "define tu contraseña". */
  async resetPassword(token: string, password: string): Promise<AuthSession> {
    const { data } = await this.post<AuthSession>('auth/reset-password', { token, password })
    return data
  }
}

export const authService = new AuthService()
