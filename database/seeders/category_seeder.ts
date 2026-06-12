import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    const categories = [
      {
        name: 'Sepak Bola',
        description: 'Perlengkapan sepak bola untuk latihan dan pertandingan.',
      },
      {
        name: 'Fitness',
        description: 'Peralatan gym, beban, dan aksesori latihan kekuatan.',
      },
      {
        name: 'Gymnastic',
        description: 'Perlengkapan senam, stretching, dan latihan kelenturan.',
      },
      {
        name: 'Bulutangkis',
        description: 'Raket, shuttlecock, grip, dan aksesori bulutangkis.',
      },
      {
        name: 'Lari dan Training',
        description: 'Perlengkapan lari, kardio, dan latihan harian.',
      },
      {
        name: 'Basket',
        description: 'Bola, sepatu, jersey, ring, dan aksesori basket.',
      },
      {
        name: 'Renang',
        description: 'Perlengkapan renang untuk latihan dan kompetisi.',
      },
      {
        name: 'Tenis',
        description: 'Raket, bola, grip, dan perlengkapan tenis lapangan.',
      },
      {
        name: 'Outdoor',
        description: 'Peralatan hiking, camping, dan aktivitas luar ruang.',
      },
      {
        name: 'Proteksi Olahraga',
        description: 'Pelindung tubuh untuk olahraga kontak dan latihan intensif.',
      },
    ]

    for (const category of categories) {
      await Category.updateOrCreate({ name: category.name }, category)
    }
  }
}
