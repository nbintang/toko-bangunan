import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Form } from '@adonisjs/inertia/react'

export function LoginForm({ className }: React.ComponentProps<'form'>) {
  return (
  <Form className={cn('flex flex-col gap-6', className)} route="session.store" >
      {({ errors, processing }) => (
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              className="bg-background"
              data-invalid={errors.email ? 'true' : undefined}
            />
            {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>

            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-background"
              data-invalid={errors.password ? 'true' : undefined}
            />
            {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
          </Field>

          <Field>
            <Button type="submit" disabled={processing}>
              {processing ? 'Logging in...' : 'Login'}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <Button variant="outline" type="button">
              Login with GitHub
            </Button>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      )}
    </Form>
  )
}
