import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
import Product from '#models/product'
import StockTransaction from '#models/stock_transaction'

export default class extends BaseSeeder {
  async run() {
    const products = [
      ...createProducts('Sepak Bola', 'SPB', [
        ['Bola Sepak Size 5', 'pcs'],
        ['Sepatu Bola Stud FG', 'pasang'],
        ['Jersey Bola Training', 'pcs'],
        ['Sarung Tangan Kiper', 'pasang'],
      ]),
      ...createProducts('Fitness', 'FIT', [
        ['Dumbbell Hex 5kg', 'pcs'],
        ['Barbell Plate 10kg', 'pcs'],
        ['Kettlebell 8kg', 'pcs'],
        ['Bench Press Adjustable', 'unit'],
      ]),
      ...createProducts('Gymnastic', 'GYM', [
        ['Yoga Mat 6mm', 'pcs'],
        ['Gym Ball 65cm', 'pcs'],
        ['Foam Roller Medium', 'pcs'],
        ['Pilates Ring', 'pcs'],
      ]),
      ...createProducts('Bulutangkis', 'BLT', [
        ['Raket Badminton Carbon', 'pcs'],
        ['Shuttlecock Nylon', 'tube'],
        ['Grip Raket Premium', 'roll'],
        ['Net Badminton Portable', 'unit'],
      ]),
      ...createProducts('Lari dan Training', 'LRT', [
        ['Resistance Band Set', 'set'],
        ['Skipping Rope Speed', 'pcs'],
        ['Cone Training Set', 'set'],
        ['Agility Ladder', 'pcs'],
      ]),
      ...createProducts('Basket', 'BSK', [
        ['Bola Basket Indoor', 'pcs'],
        ['Jersey Basket Reversible', 'pcs'],
        ['Ring Basket Portable', 'unit'],
        ['Sleeve Arm Compression', 'pasang'],
      ]),
      ...createProducts('Renang', 'RNG', [
        ['Kacamata Renang Anti Fog', 'pcs'],
        ['Topi Renang Silicone', 'pcs'],
        ['Kickboard Training', 'pcs'],
        ['Pull Buoy Foam', 'pcs'],
      ]),
      ...createProducts('Tenis', 'TNS', [
        ['Raket Tenis Graphite', 'pcs'],
        ['Bola Tenis Pressurized', 'kaleng'],
        ['Grip Tenis Overgrip', 'roll'],
        ['Tas Raket Tenis', 'pcs'],
      ]),
      ...createProducts('Outdoor', 'OTD', [
        ['Trekking Pole Aluminum', 'pasang'],
        ['Headlamp Outdoor', 'pcs'],
        ['Dry Bag 10L', 'pcs'],
        ['Matras Camping Lipat', 'pcs'],
      ]),
      ...createProducts('Proteksi Olahraga', 'PRT', [
        ['Knee Support Elastic', 'pcs'],
        ['Elbow Guard Foam', 'pasang'],
        ['Ankle Support Strap', 'pcs'],
        ['Mouth Guard Training', 'pcs'],
      ]),
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

function createProducts(categoryName: string, prefix: string, items: [string, string][]) {
  return items.map(([name, unit], index) => {
    const sequence = index + 1
    const stock = 28 + ((prefix.charCodeAt(0) + sequence * 13) % 95)
    const minimumStock = 6 + ((prefix.charCodeAt(1) + sequence * 5) % 18)

    return {
      categoryName,
      code: `${prefix}-${String(sequence).padStart(3, '0')}`,
      name,
      description: `${name} untuk kebutuhan toko olahraga, latihan, dan penjualan harian.`,
      unit,
      stock,
      minimumStock,
    }
  })
}
