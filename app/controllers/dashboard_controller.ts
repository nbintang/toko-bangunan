import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

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

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [categories, products, transactions, users] = await Promise.all([
      Category.query().orderBy('name', 'asc'),
      Product.query().orderBy('name', 'asc'),
      StockTransaction.query().orderBy('transactionDate', 'desc').orderBy('id', 'desc'),
      User.query(),
    ])

    const categoryById = new Map(
      categories.map((category) => [category.id, serializeCategory(category)])
    )
    const userById = new Map(users.map((user) => [user.id, serializeUser(user)]))

    const serializedProducts = products.map((product) =>
      serializeProduct(product, categoryById.get(product.categoryId) ?? null)
    )
    const productById = new Map(serializedProducts.map((product) => [product.id, product]))

    const lowStockProducts = serializedProducts
      .filter((product) => product.stock < 10)
      .sort((first, second) => first.stock - second.stock)
      .slice(0, 5)

    const topMinProducts = lowStockProducts
    const topMaxProducts = serializedProducts
      .filter((product) => product.stock >= 10)
      .sort((first, second) => second.stock - first.stock)
      .slice(0, 5)

    const latestTransactions = transactions.slice(0, 5).map((transaction) => {
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

    const today = DateTime.now()
    const chartDataByDate = new Map<
      string,
      { date: string; label: string; stockIn: number; stockOut: number }
    >()

    transactions
      .filter(
        (transaction) =>
          transaction.transactionDate.month === today.month &&
          transaction.transactionDate.year === today.year
      )
      .forEach((transaction) => {
        const date = transaction.transactionDate.toISODate() ?? ''
        const current = chartDataByDate.get(date) ?? {
          date,
          label: transaction.transactionDate.toFormat('dd LLL'),
          stockIn: 0,
          stockOut: 0,
        }

        if (transaction.type === 'in') {
          current.stockIn += transaction.quantity
        }

        if (transaction.type === 'out') {
          current.stockOut += transaction.quantity
        }

        chartDataByDate.set(date, current)
      })

    return inertia.render('dashboard/overview', {
      totalProducts: products.length,
      totalStock: products.reduce((total, product) => total + product.stock, 0),
      totalStockIn: transactions
        .filter((transaction) => transaction.type === 'in')
        .reduce((total, transaction) => total + transaction.quantity, 0),
      totalStockOut: transactions
        .filter((transaction) => transaction.type === 'out')
        .reduce((total, transaction) => total + transaction.quantity, 0),
      lowStockCount: products.filter((product) => product.stock < 10).length,
      lowStockProducts,
      topMinProducts,
      topMaxProducts,
      latestTransactions,
      chartData: Array.from(chartDataByDate.values()).sort((first, second) =>
        first.date.localeCompare(second.date)
      ),
    })
  }
}
