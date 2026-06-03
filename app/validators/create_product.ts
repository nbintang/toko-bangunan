import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  categoryId: vine.number().positive(),
  code: vine.string().trim().maxLength(255).unique({ table: 'products', column: 'code' }),
  name: vine.string().trim().maxLength(255),
  unit: vine.string().trim().maxLength(255),
  stock: vine.number().min(0),
  minimumStock: vine.number().min(0),
  description: vine.string().trim().nullable().optional(),
})
