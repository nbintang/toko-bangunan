import vine from '@vinejs/vine'

export const updateProductValidator = vine.create({
  categoryId: vine.number().positive(),
  code: vine.string().trim().maxLength(255),
  name: vine.string().trim().maxLength(255),
  unit: vine.string().trim().maxLength(255),
  stock: vine.number().min(0),
  minimumStock: vine.number().min(0),
  description: vine.string().trim().nullable().optional(),
})
