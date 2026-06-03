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
    ]

    for (const category of categories) {
      await Category.updateOrCreate({ name: category.name }, category)
    }
  }
}
