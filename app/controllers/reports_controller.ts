import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

function serializeCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
  }
}

function serializeProduct(product: Product, category: ReturnType<typeof serializeCategory> | null) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    unit: product.unit,
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

export default class ReportsController {
  async index({ inertia, request }: HttpContext) {
    const type = request.input('type') as string | undefined
    const startDate = request.input('startDate', request.input('start_date')) as string | undefined
    const endDate = request.input('endDate', request.input('end_date')) as string | undefined
    const query = StockTransaction.query()

    if (type) {
      query.where('type', type)
    }

    if (startDate) {
      query.where('transactionDate', '>=', startDate)
    }

    if (endDate) {
      query.where('transactionDate', '<=', endDate)
    }

    const transactions = await query.orderBy('transactionDate', 'desc').orderBy('id', 'desc')
    const products = await Product.query()
    const categories = await Category.query()
    const users = await User.query()

    const categoryById = new Map(
      categories.map((category) => [category.id, serializeCategory(category)])
    )
    const serializedProducts = products.map((product) =>
      serializeProduct(product, categoryById.get(product.categoryId) ?? null)
    )
    const productById = new Map(serializedProducts.map((product) => [product.id, product]))
    const userById = new Map(users.map((user) => [user.id, serializeUser(user)]))

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

    return inertia.render('dashboard/reports/index', {
      transactions: serializedTransactions,
      totalTransactions: transactions.length,
      totalIn: transactions
        .filter((transaction) => transaction.type === 'in')
        .reduce((total, transaction) => total + transaction.quantity, 0),
      totalOut: transactions
        .filter((transaction) => transaction.type === 'out')
        .reduce((total, transaction) => total + transaction.quantity, 0),
      type,
      startDate,
      endDate,
    })
  }
}
