import { type Data } from '@generated/data'
import { type ReactElement } from 'react'
import { FlashToaster } from '@/components/flash-toaster'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  return (
    <>
      <FlashToaster />
      <div className="flex min-h-screen flex-col items-center justify-center">{children}</div>
    </>
  )
}
