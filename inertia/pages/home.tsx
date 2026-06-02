import { Link } from '@adonisjs/inertia/react'
import { LogIn } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function Home() {
  return (
    <>
      <Button asChild>
        <Link href={'/auth/login'}>
          <LogIn />
          Loginkan Bosku
        </Link>
      </Button>
    </>
  )
}
