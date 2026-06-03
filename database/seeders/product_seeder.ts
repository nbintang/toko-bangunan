import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'

export default class extends BaseSeeder {
  async run() {
    const products = [
      {
        categoryName: 'Sepak Bola',
        code: 'SPB-001',
        name: 'Bola Sepak Size 5',
        description: 'Bola sepak standar pertandingan untuk lapangan outdoor.',
        unit: 'pcs',
        stock: 48,
        minimumStock: 10,
      },
      {
        categoryName: 'Sepak Bola',
        code: 'SPB-002',
        name: 'Sepatu Bola Stud FG',
        description: 'Sepatu bola untuk lapangan rumput natural.',
        unit: 'pasang',
        stock: 32,
        minimumStock: 8,
      },
      {
        categoryName: 'Fitness',
        code: 'FIT-001',
        name: 'Dumbbell Hex 5kg',
        description: 'Dumbbell karet hex untuk latihan beban harian.',
        unit: 'pcs',
        stock: 56,
        minimumStock: 12,
      },
      {
        categoryName: 'Fitness',
        code: 'FIT-002',
        name: 'Barbell Plate 10kg',
        description: 'Plate beban besi 10kg untuk barbell dan power rack.',
        unit: 'pcs',
        stock: 72,
        minimumStock: 16,
      },
      {
        categoryName: 'Gymnastic',
        code: 'GYM-001',
        name: 'Yoga Mat 6mm',
        description: 'Matras anti slip untuk yoga, pilates, dan stretching.',
        unit: 'pcs',
        stock: 64,
        minimumStock: 14,
      },
      {
        categoryName: 'Gymnastic',
        code: 'GYM-002',
        name: 'Gym Ball 65cm',
        description: 'Bola gym untuk latihan core, balance, dan rehabilitasi.',
        unit: 'pcs',
        stock: 30,
        minimumStock: 8,
      },
      {
        categoryName: 'Bulutangkis',
        code: 'BLT-001',
        name: 'Raket Badminton Carbon',
        description: 'Raket ringan untuk latihan dan pertandingan bulutangkis.',
        unit: 'pcs',
        stock: 42,
        minimumStock: 10,
      },
      {
        categoryName: 'Bulutangkis',
        code: 'BLT-002',
        name: 'Shuttlecock Nylon',
        description: 'Shuttlecock nylon isi 6 untuk latihan rutin.',
        unit: 'tube',
        stock: 90,
        minimumStock: 20,
      },
      {
        categoryName: 'Lari dan Training',
        code: 'LRT-001',
        name: 'Resistance Band Set',
        description: 'Set resistance band untuk warm up dan latihan strength.',
        unit: 'set',
        stock: 52,
        minimumStock: 12,
      },
      {
        categoryName: 'Lari dan Training',
        code: 'LRT-002',
        name: 'Skipping Rope Speed',
        description: 'Tali skipping speed rope untuk kardio dan agility.',
        unit: 'pcs',
        stock: 68,
        minimumStock: 15,
      },
    ]

    const obsoleteProductCodes = [
      'SMN-001',
      'SMN-002',
      'BES-001',
      'BES-002',
      'CAT-001',
      'CAT-002',
      'PRK-001',
      'PRK-002',
      'PIP-001',
      'PIP-002',
    ]
    const obsoleteCategoryNames = [
      'Semen',
      'Besi dan Baja',
      'Cat dan Pelapis',
      'Perkakas',
      'Pipa dan Sanitair',
    ]
    const obsoleteProducts = await Product.query().whereIn('code', obsoleteProductCodes)
    const obsoleteProductIds = obsoleteProducts.map((product) => product.id)

    if (obsoleteProductIds.length > 0) {
      await StockTransaction.query().whereIn('productId', obsoleteProductIds).delete()
      await Product.query().whereIn('id', obsoleteProductIds).delete()
    }

    await Category.query().whereIn('name', obsoleteCategoryNames).delete()

    const categories = await Category.query()
    const categoryByName = new Map(categories.map((category) => [category.name, category.id]))

    for (const product of products) {
      const categoryId = categoryByName.get(product.categoryName)

      if (!categoryId) {
        throw new Error(`Category "${product.categoryName}" belum tersedia untuk product seeder`)
      }

      const { categoryName, ...payload } = product

      await Product.updateOrCreate(
        { code: payload.code },
        {
          ...payload,
          categoryId,
        }
      )
    }
  }
}
