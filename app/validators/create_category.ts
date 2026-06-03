import vine from '@vinejs/vine'

export const createCategoryValidator = vine.create({
  name: vine.string().trim().maxLength(255).unique({ table: 'categories', column: 'name' }),
  description: vine.string().trim().nullable().optional(),
})
