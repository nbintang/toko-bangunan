import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const user = await User.query().where('email', 'admin@tokolahraga.test').firstOrFail()
    const seededProductCodes = [
      'SPB-001',
      'SPB-002',
      'FIT-001',
      'FIT-002',
      'GYM-001',
      'GYM-002',
      'BLT-001',
      'BLT-002',
      'LRT-001',
      'LRT-002',
    ]
    const products = await Product.query().whereIn('code', seededProductCodes)
    const productByCode = new Map(products.map((product) => [product.code, product]))
    const initialStockByCode = new Map([
      ['SPB-001', 60],
      ['FIT-001', 64],
      ['FIT-002', 80],
      ['GYM-001', 72],
      ['BLT-002', 100],
    ])

    for (const product of products) {
      const initialStock = initialStockByCode.get(product.code) ?? product.stock

      await StockTransaction.updateOrCreate(
        {
          productId: product.id,
          type: 'in',
          note: 'Stok awal dari seeder',
        },
        {
          productId: product.id,
          userId: user.id,
          type: 'in',
          quantity: initialStock,
          stockAfter: initialStock,
          transactionDate: DateTime.fromISO('2026-01-01'),
          note: 'Stok awal dari seeder',
        }
      )
    }

    const transactions = [
      {
        productCode: 'SPB-001',
        type: 'out',
        quantity: 12,
        stockAfter: 48,
        transactionDate: '2026-01-05',
        note: 'Penjualan bola untuk klub futsal sekolah',
      },
      {
        productCode: 'FIT-001',
        type: 'out',
        quantity: 8,
        stockAfter: 56,
        transactionDate: '2026-01-06',
        note: 'Penjualan dumbbell untuk member gym',
      },
      {
        productCode: 'FIT-002',
        type: 'out',
        quantity: 8,
        stockAfter: 72,
        transactionDate: '2026-01-07',
        note: 'Penjualan barbell plate untuk home gym',
      },
      {
        productCode: 'GYM-001',
        type: 'out',
        quantity: 8,
        stockAfter: 64,
        transactionDate: '2026-01-08',
        note: 'Penjualan yoga mat untuk kelas senam',
      },
      {
        productCode: 'BLT-002',
        type: 'out',
        quantity: 10,
        stockAfter: 90,
        transactionDate: '2026-01-09',
        note: 'Penjualan shuttlecock untuk latihan bulutangkis',
      },
    ]

    for (const transaction of transactions) {
      const product = productByCode.get(transaction.productCode)

      if (!product) {
        throw new Error(
          `Product "${transaction.productCode}" belum tersedia untuk stock transaction seeder`
        )
      }

      await StockTransaction.updateOrCreate(
        {
          productId: product.id,
          type: transaction.type,
          note: transaction.note,
        },
        {
          productId: product.id,
          userId: user.id,
          type: transaction.type,
          quantity: transaction.quantity,
          stockAfter: transaction.stockAfter,
          transactionDate: DateTime.fromISO(transaction.transactionDate),
          note: transaction.note,
        }
      )
    }
  }
}
