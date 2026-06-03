import vine from '@vinejs/vine'

export const stockTransactionValidator = vine.create({
  productId: vine.number().positive(),
  type: vine.enum(['in', 'out']),
  quantity: vine.number().min(1),
  transactionDate: vine.date(),
  note: vine.string().trim().nullable().optional(),
})
