import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'
import User from '#models/user'
import { DateTime } from 'luxon'

type TransactionType = 'in' | 'out'

const seededProductPrefixes = new Set([
  'SPB',
  'FIT',
  'GYM',
  'BLT',
  'LRT',
  'BSK',
  'RNG',
  'TNS',
  'OTD',
  'PRT',
])

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().where('email', 'like', '%@tokolahraga.test').orderBy('id', 'asc')
    const products = (await Product.query().orderBy('code', 'asc')).filter((product) =>
      seededProductPrefixes.has(product.code.split('-')[0])
    )

    if (users.length === 0) {
      throw new Error('User tokolahraga belum tersedia untuk stock transaction seeder')
    }

    const stockByCode = new Map<string, number>()

    for (const [index, product] of products.entries()) {
      const initialStock = product.stock + ((index * 11) % 35)
      const initialDate = DateTime.fromISO('2026-01-02').plus({ days: (index * 3) % 70 })
      const user = users[index % users.length]

      stockByCode.set(product.code, initialStock)

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
          transactionDate: initialDate,
          note: 'Stok awal dari seeder',
        }
      )
    }

    for (const [productIndex, product] of products.entries()) {
      for (let step = 1; step <= 6; step++) {
        const type: TransactionType = step % 3 === 0 ? 'in' : 'out'
        const quantity = getQuantity(productIndex, step, type)
        const transactionDate = DateTime.fromISO('2026-01-08').plus({
          days: (productIndex * 9 + step * 17) % 170,
        })
        const stockAfter = getNextStockAfter(stockByCode, product.code, type, quantity)
        const user = users[(productIndex + step * 5) % users.length]
        const note = buildNote(product.name, type, productIndex, step)

        await StockTransaction.updateOrCreate(
          {
            productId: product.id,
            type,
            note,
          },
          {
            productId: product.id,
            userId: user.id,
            type,
            quantity,
            stockAfter,
            transactionDate,
            note,
          }
        )
      }
    }

    for (const product of products) {
      product.stock = stockByCode.get(product.code) ?? product.stock
      await product.save()
    }
  }
}

function getQuantity(productIndex: number, step: number, type: TransactionType) {
  const base = 3 + ((productIndex * 7 + step * 5) % 18)

  return type === 'in' ? base + 8 : base
}

function getNextStockAfter(
  stockByCode: Map<string, number>,
  productCode: string,
  type: TransactionType,
  quantity: number
) {
  const currentStock = stockByCode.get(productCode) ?? 0
  const nextStock = type === 'in' ? currentStock + quantity : Math.max(currentStock - quantity, 0)

  stockByCode.set(productCode, nextStock)

  return nextStock
}

function buildNote(productName: string, type: TransactionType, productIndex: number, step: number) {
  const outboundNotes = [
    'Penjualan retail harian',
    'Penjualan untuk komunitas olahraga',
    'Pengeluaran stok event sekolah',
    'Pesanan klub latihan',
    'Penyesuaian stok keluar gudang',
  ]
  const inboundNotes = [
    'Restock supplier utama',
    'Tambahan stok promo bulanan',
    'Penerimaan barang gudang pusat',
    'Restock permintaan cabang',
    'Penerimaan stok musiman',
  ]
  const notes = type === 'in' ? inboundNotes : outboundNotes

  return `${notes[(productIndex + step) % notes.length]} - ${productName}`
}
