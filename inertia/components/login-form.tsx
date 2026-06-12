import { cn } from '@/lib/utils'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Form } from '@adonisjs/inertia/react'
import { SubmitButton } from '@/components/submit_button'
import { PasswordInput } from '@/components/password_input'

export function LoginForm({ className }: React.ComponentProps<'form'>) {
  return (
    <Form
      className={cn('flex flex-col gap-6', className)}
      route="session.store"
      noValidate
      resetOnError={['password']}
    >
      {({ errors, processing }) => (
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Masuk ke Akun Anda</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Masukkan email dan kata sandi untuk melanjutkan.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="nama@contoh.com"
              className="bg-background"
              data-invalid={errors.email ? 'true' : undefined}
            />
            {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>

            <PasswordInput
              id="password"
              name="password"
              placeholder="Masukkan kata sandi"
              data-invalid={errors.password ? 'true' : undefined}
            />
            {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
          </Field>

          <Field>
            <SubmitButton loading={processing} loadingText="Sedang masuk...">
              Masuk
            </SubmitButton>
          </Field>
        </FieldGroup>
      )}
    </Form>
  )
}
