import Category from '#models/category'
import Product from '#models/product'
import { createCategoryValidator } from '#validators/create_category'
import { updateCategoryValidator } from '#validators/update_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('name', 'asc')

    return inertia.render('dashboard/master-data/categories/index', { categories })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator)

    await Category.create(payload)

    session.flash('success', 'Kategori barang berhasil ditambahkan.')
    return response.redirect().toRoute('dashboard.master_data.categories.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const payload = await request.validateUsing(updateCategoryValidator)
    const existingCategory = await Category.query()
      .where('name', payload.name)
      .whereNot('id', category.id)
      .first()

    if (existingCategory) {
      session.flash('error', 'Nama kategori sudah digunakan.')
      return response.redirect().toRoute('dashboard.master_data.categories.index')
    }

    category.merge(payload)
    await category.save()

    session.flash('success', 'Kategori barang berhasil diperbarui.')
    return response.redirect().toRoute('dashboard.master_data.categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const usedByProduct = await Product.query().where('categoryId', category.id).first()

    if (usedByProduct) {
      session.flash(
        'error',
        'Kategori tidak dapat dihapus karena masih digunakan oleh data produk.'
      )
      return response.redirect().toRoute('dashboard.master_data.categories.index')
    }

    await category.delete()

    session.flash('success', 'Kategori barang berhasil dihapus.')
    return response.redirect().toRoute('dashboard.master_data.categories.index')
  }
}
