import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      {
        email: 'admin@tokobangunan.test',
      },
      {
        fullName: 'Administrator',
        password: await hash.make('password'),
      }
    )
  }
}
