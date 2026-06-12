import { Form } from '@adonisjs/inertia/react'
import { SubmitButton } from '@/components/submit_button'

export default function Signup() {
  return (
    <div className="form-container">
      <div>
        <h1> Signup </h1>
        <p>Enter your details below to create your account</p>
      </div>

      <div>
        <Form route="new_account.store">
          {({ errors, processing }) => (
            <>
              <div>
                <label htmlFor="fullName">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Enter your full name"
                  data-invalid={errors.fullName ? 'true' : undefined}
                />
                {errors.fullName && <div>{errors.fullName}</div>}
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirm password</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

              <div>
                <SubmitButton loading={processing} loadingText="Creating account...">
                  Sign up
                </SubmitButton>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
