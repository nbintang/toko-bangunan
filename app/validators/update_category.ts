import vine from '@vinejs/vine'

export const updateCategoryValidator = vine.create({
  name: vine.string().trim().maxLength(255),
  description: vine.string().trim().nullable().optional(),
})
