import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
    .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table.string('code').notNullable().unique()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('unit').notNullable()
      table.integer('stock').notNullable().defaultTo(0)
      table.integer('minimum_stock').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
