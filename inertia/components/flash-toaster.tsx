import { usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import type { InertiaProps } from '~/types'

export function FlashToaster() {
  const { props, url } = usePage<InertiaProps>()
  const errorsKey = JSON.stringify(props.errors)

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (props.flash.error) {
      toast.error(props.flash.error)
    }

    if (props.flash.success) {
      toast.success(props.flash.success)
    }
  }, [props.flash.error, props.flash.success])

  useEffect(() => {
    if (props.flash.error || Object.keys(props.errors).length === 0) {
      return
    }

    toast.error('Periksa kembali input form.')
  }, [errorsKey, props.errors, props.flash.error])

  return <Toaster />
}
