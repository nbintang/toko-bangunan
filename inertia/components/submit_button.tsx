import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
  loadingText?: string
}

export function SubmitButton({
  children,
  disabled,
  loading = false,
  loadingText = 'Memproses...',
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading && <Spinner data-icon="inline-start" />}
      {loading ? loadingText : children}
    </Button>
  )
}
