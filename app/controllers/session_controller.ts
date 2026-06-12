import User from '#models/user'
import { loginValidator } from '#validators/user'
import { errors as authErrors } from '@adonisjs/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      session.flash('success', 'Login berhasil.')
      return response.redirect().toRoute('dashboard.overview')
    } catch (error) {
      if (!authErrors.E_INVALID_CREDENTIALS.isError(error)) {
        throw error
      }

      session.flashOnly(['email'])
      session.flash('error', 'Email atau password tidak valid.')
      session.flash('inputErrorsBag', {
        email: ['Email atau password tidak valid.'],
      })

      return response.redirect().back()
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    response.redirect().toRoute('session.create')
  }
}
