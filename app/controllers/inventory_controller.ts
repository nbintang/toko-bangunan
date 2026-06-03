import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import { stockTransactionValidator } from '#validators/stock_transaction'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

function serializeCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
  }
}

function serializeProduct(product: Product, category: ReturnType<typeof serializeCategory> | null) {
  return {
    id: product.id,
    categoryId: product.categoryId,
    code: product.code,
    name: product.name,
    unit: product.unit,
    stock: product.stock,
    minimumStock: product.minimumStock,
    description: product.description,
    category,
  }
}

function serializeUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  }
}

export default class InventoryController {
  async index({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('name', 'asc')
    const products = await Product.query().orderBy('name', 'asc')
    const transactions = await StockTransaction.query()
      .orderBy('transactionDate', 'desc')
      .orderBy('id', 'desc')
    const users = await User.query()

    const categoryById = new Map(
      categories.map((category) => [category.id, serializeCategory(category)])
    )
    const userById = new Map(users.map((user) => [user.id, serializeUser(user)]))

    const serializedProducts = products.map((product) =>
      serializeProduct(product, categoryById.get(product.categoryId) ?? null)
    )
    const productById = new Map(serializedProducts.map((product) => [product.id, product]))

    const serializedTransactions = transactions.map((transaction) => {
      const product = productById.get(transaction.productId)

      return {
        id: transaction.id,
        productId: transaction.productId,
        userId: transaction.userId,
        type: transaction.type as 'in' | 'out',
        quantity: transaction.quantity,
        stockAfter: transaction.stockAfter,
        transactionDate: transaction.transactionDate.toISODate() ?? '',
        note: transaction.note,
        product: product ? product : null,
        user: userById.get(transaction.userId) ?? null,
      }
    })

    return inertia.render('dashboard/inventory/index', {
      products: serializedProducts,
      transactions: serializedTransactions,
      totalProducts: products.length,
      totalStock: products.reduce((total, product) => total + product.stock, 0),
      lowStockCount: products.filter(
        (product) => product.stock <= product.minimumStock && product.stock > 0
      ).length,
      emptyStockCount: products.filter((product) => product.stock === 0).length,
    })
  }

  async storeTransaction({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(stockTransactionValidator)

    const result = await db.transaction(async (trx) => {
      const product = await Product.query({ client: trx })
        .where('id', payload.productId)
        .forUpdate()
        .firstOrFail()

      if (payload.type === 'out' && payload.quantity > product.stock) {
        return { success: false }
      }

      const stockAfter =
        payload.type === 'in' ? product.stock + payload.quantity : product.stock - payload.quantity

      await StockTransaction.create(
        {
          productId: product.id,
          userId: auth.user!.id,
          type: payload.type,
          quantity: payload.quantity,
          stockAfter,
          transactionDate: payload.transactionDate,
          note: payload.note ?? null,
        },
        { client: trx }
      )

      product.useTransaction(trx)
      product.stock = stockAfter
      await product.save()

      return { success: true }
    })

    if (!result.success) {
      session.flash('error', 'Jumlah barang keluar tidak boleh melebihi stok tersedia.')
      return response.redirect().toRoute('dashboard.inventory.index')
    }

    session.flash('success', 'Transaksi persediaan berhasil disimpan.')
    return response.redirect().toRoute('dashboard.inventory.index')
  }
}
