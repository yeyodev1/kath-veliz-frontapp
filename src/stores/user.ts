import { defineStore } from 'pinia'
import { authService, type ProfilePayload, type RegisterPayload } from '@/services/auth.service'
import type { SessionUser } from '@/types'

const TOKEN_KEY = 'access_token'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as SessionUser | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.user),
    isAdmin: (s) => s.user?.accountType === 'admin',
    hasToken: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  },

  actions: {
    setSession(token: string, user: SessionUser) {
      try {
        localStorage.setItem(TOKEN_KEY, token)
      } catch {
        // Modo privado: la sesión dura lo que dure la pestaña.
      }
      this.user = user
    },

    async login(email: string, password: string): Promise<SessionUser> {
      const { token, user } = await authService.login(email, password)
      this.setSession(token, user)
      return user
    },

    async register(payload: RegisterPayload): Promise<SessionUser> {
      const { token, user } = await authService.register(payload)
      this.setSession(token, user)
      return user
    },

    async updateProfile(payload: ProfilePayload): Promise<SessionUser> {
      const user = await authService.updateProfile(payload)
      // Se mezcla por si el API devuelve solo los campos editados.
      this.user = { ...(this.user as SessionUser), ...user }
      return this.user
    },

    /** Siempre resuelve bien: el API no revela si el correo existe. */
    async forgot(email: string): Promise<void> {
      await authService.forgotPassword(email)
    },

    /** Guarda la contraseña nueva y deja la sesión iniciada. */
    async reset(token: string, password: string): Promise<SessionUser> {
      const session = await authService.resetPassword(token, password)
      this.setSession(session.token, session.user)
      return session.user
    },

    async changePassword(current: string, next: string): Promise<void> {
      await authService.changePassword(current, next)
    },

    /** Recupera la sesión desde el token guardado, verificándola con el API. */
    async restore(): Promise<SessionUser | null> {
      if (this.user) return this.user
      if (!localStorage.getItem(TOKEN_KEY)) return null

      this.loading = true
      try {
        this.user = await authService.me()
        return this.user
      } catch {
        this.clear()
        return null
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.user = null
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* nada que limpiar */
      }
    },
  },
})
