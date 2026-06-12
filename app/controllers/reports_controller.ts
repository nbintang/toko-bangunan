import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import { getPaginationParams } from '#services/pagination'
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
    const search = request.input('search') as string | undefined
    const { page, perPage } = getPaginationParams(request.input('page'), request.input('perPage'))
    const matchingProductIds = new Set<number>()
    const matchingUserIds = new Set<number>()
    const normalizedSearch = search?.toLowerCase()

    if (normalizedSearch) {
      const matchingCategories = await Category.query().whereILike('name', `%${search}%`)
      const matchingCategoryIds = matchingCategories.map((category) => category.id)
      const matchingProducts = await Product.query().where((builder) => {
        builder
          .whereILike('name', `%${search}%`)
          .orWhereILike('code', `%${search}%`)
          .orWhereILike('unit', `%${search}%`)

        if (matchingCategoryIds.length > 0) {
          builder.orWhereIn('categoryId', matchingCategoryIds)
        }
      })
      const matchingUsers = await User.query().where((builder) => {
        builder.whereILike('fullName', `%${search}%`).orWhereILike('email', `%${search}%`)
      })

      for (const product of matchingProducts) {
        matchingProductIds.add(product.id)
      }

      for (const user of matchingUsers) {
        matchingUserIds.add(user.id)
      }
    }

    function createTransactionsQuery() {
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

      if (search) {
        query.where((builder) => {
          builder
            .whereILike('note', `%${search}%`)
            .orWhereILike('type', `%${search}%`)
            .orWhereILike('transactionDate', `%${search}%`)

          if (matchingProductIds.size > 0) {
            builder.orWhereIn('productId', [...matchingProductIds])
          }

          if (matchingUserIds.size > 0) {
            builder.orWhereIn('userId', [...matchingUserIds])
          }
        })
      }

      return query
    }

    const transactions = await createTransactionsQuery()
      .orderBy('transactionDate', 'desc')
      .orderBy('id', 'desc')
      .paginate(page, perPage)
    const quantityTotals = await createTransactionsQuery()
      .select('type')
      .sum('quantity as totalQuantity')
      .groupBy('type')
    const transactionRows = transactions.all()
    const productIds = [...new Set(transactionRows.map((transaction) => transaction.productId))]
    const userIds = [...new Set(transactionRows.map((transaction) => transaction.userId))]
    const [products, users] = await Promise.all([
      productIds.length > 0 ? Product.query().whereIn('id', productIds) : [],
      userIds.length > 0 ? User.query().whereIn('id', userIds) : [],
    ])
    const categoryIds = [...new Set(products.map((product) => product.categoryId))]
    const categories =
      categoryIds.length > 0 ? await Category.query().whereIn('id', categoryIds) : []
    const categoryById = new Map(
      categories.map((category) => [category.id, serializeCategory(category)])
    )
    const serializedProducts = products.map((product) =>
      serializeProduct(product, categoryById.get(product.categoryId) ?? null)
    )
    const productById = new Map(serializedProducts.map((product) => [product.id, product]))
    const userById = new Map(users.map((user) => [user.id, serializeUser(user)]))

    const serializedTransactions = transactionRows.map((transaction) => {
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
      transactions: {
        data: serializedTransactions,
        meta: transactions.getMeta(),
      },
      totalTransactions: transactions.total,
      totalIn: getQuantityTotal(quantityTotals, 'in'),
      totalOut: getQuantityTotal(quantityTotals, 'out'),
      type,
      startDate,
      endDate,
      search,
    })
  }
}

function getQuantityTotal(totals: Array<StockTransaction>, type: 'in' | 'out') {
  const row = totals.find((total) => total.type === type)
  return Number(row?.$extras.totalQuantity ?? 0)
}
