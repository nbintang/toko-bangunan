import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CategorySeeder from './category_seeder.js'
import ProductSeeder from './product_seeder.js'
import StockTransactionSeeder from './stock_transaction_seeder.js'
import UserSeeder from './user_seeder.js'

export default class extends BaseSeeder {
  async run() {
    const seeders = [UserSeeder, CategorySeeder, ProductSeeder, StockTransactionSeeder]

    for (const Seeder of seeders) {
      await new Seeder(this.client).run()
    }
  }
}
