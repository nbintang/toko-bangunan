import vine from '@vinejs/vine'

export const updateProfileValidator = vine.create({
  fullName: vine.string().trim().maxLength(255),
  email: vine.string().email().maxLength(254),
})

export const updatePasswordValidator = vine.create({
  currentPassword: vine.string(),
  password: vine.string().minLength(8).maxLength(32).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
