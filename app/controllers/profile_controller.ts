import { updatePasswordValidator, updateProfileValidator } from '#validators/profile'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ProfileController {
  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateProfileValidator)
    const existingUser = await User.query()
      .where('email', payload.email)
      .whereNot('id', user.id)
      .first()

    if (existingUser) {
      session.flash('inputErrorsBag', {
        email: 'Email sudah digunakan oleh pengguna lain.',
      })
      return response.redirect().back()
    }

    user.fullName = payload.fullName
    user.email = payload.email
    await user.save()

    session.flash('success', 'Profil berhasil diperbarui.')
    return response.redirect().back()
  }

  async updatePassword({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updatePasswordValidator)
    const isCurrentPasswordValid = await hash.verify(user.password, payload.currentPassword)

    if (!isCurrentPasswordValid) {
      session.flash('inputErrorsBag', {
        currentPassword: 'Password lama tidak sesuai.',
      })
      return response.redirect().back()
    }

    user.password = await hash.make(payload.password)
    await user.save()

    session.flash('success', 'Password berhasil diperbarui.')
    return response.redirect().back()
  }
}
