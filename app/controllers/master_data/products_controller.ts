import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import { createProductValidator } from '#validators/create_product'
import { updateProductValidator } from '#validators/update_product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ inertia }: HttpContext) {
    const products = await Product.query().orderBy('name', 'asc')
    const categories = await Category.query().orderBy('name', 'asc')

    return inertia.render('dashboard/master-data/products/index', { products, categories })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    await Product.create(payload)

    session.flash('success', 'Barang berhasil ditambahkan.')
    return response.redirect().toRoute('dashboard.master_data.products.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateProductValidator)
    const existingProduct = await Product.query()
      .where('code', payload.code)
      .whereNot('id', product.id)
      .first()

    if (existingProduct) {
      session.flash('error', 'Kode barang sudah digunakan.')
      return response.redirect().toRoute('dashboard.master_data.products.index')
    }

    product.merge(payload)
    await product.save()

    session.flash('success', 'Barang berhasil diperbarui.')
    return response.redirect().toRoute('dashboard.master_data.products.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const hasStockTransactions = await StockTransaction.query()
      .where('productId', product.id)
      .first()

    if (hasStockTransactions) {
      session.flash(
        'error',
        'Barang tidak dapat dihapus karena sudah memiliki riwayat transaksi stok.'
      )
      return response.redirect().toRoute('dashboard.master_data.products.index')
    }

    await product.delete()

    session.flash('success', 'Barang berhasil dihapus.')
    return response.redirect().toRoute('dashboard.master_data.products.index')
  }
}
