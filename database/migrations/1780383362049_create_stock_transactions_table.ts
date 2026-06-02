import { BaseSchema } from '@adonisjs/lucid/schema'

enum TransactionType {
  IN = 'in',
  OUT = 'out',
}

export default class extends BaseSchema {
  protected tableName = 'stock_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.enum('type', Object.values(TransactionType)).notNullable()
      table.integer('quantity').notNullable()
      table.integer('stock_after').notNullable().defaultTo(0)
      table.date('transaction_date').notNullable()
      table.text('note').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
