import User from '#models/user'
import { createUserManagementValidator, updateUserManagementValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserManagementsController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('fullName', 'asc')

    return inertia.render('dashboard/master-data/users/index', { users })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createUserManagementValidator)

    await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: await hash.make(payload.password),
    })

    session.flash('success', 'Pengguna berhasil ditambahkan.')
    return response.redirect().toRoute('dashboard.master_data.user_managements.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserManagementValidator)
    const existingUser = await User.query()
      .where('email', payload.email)
      .whereNot('id', user.id)
      .first()

    if (existingUser) {
      session.flash('error', 'Email sudah digunakan.')
      return response.redirect().toRoute('dashboard.master_data.user_managements.index')
    }

    user.fullName = payload.fullName
    user.email = payload.email

    if (payload.password) {
      user.password = await hash.make(payload.password)
    }

    await user.save()

    session.flash('success', 'Pengguna berhasil diperbarui.')
    return response.redirect().toRoute('dashboard.master_data.user_managements.index')
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user?.id === user.id) {
      session.flash('error', 'Akun yang sedang digunakan tidak dapat dihapus.')
      return response.redirect().toRoute('dashboard.master_data.user_managements.index')
    }

    await user.delete()

    session.flash('success', 'Pengguna berhasil dihapus.')
    return response.redirect().toRoute('dashboard.master_data.user_managements.index')
  }
}
