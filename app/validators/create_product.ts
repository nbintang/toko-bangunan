import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  name: vine.string(),
  code: vine.string().trim().minLength(3).maxLength(50).optional(),
  unit: vine.string().trim().minLength(3).maxLength(50).optional(),
  minimumStock: vine.number().min(0).optional(),
  stock: vine.number().min(0).optional(),
  categoryId: vine.number().positive().optional(),
})
