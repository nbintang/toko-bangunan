import * as React from 'react'
import { router, usePage } from '@inertiajs/react'
import { EditIcon, MailIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps

export default function ProfileIndex({ user }: PageProps) {
  const { errors } = usePage<InertiaProps>().props
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
  })
  const displayName = user?.fullName ?? user?.email ?? '-'

  React.useEffect(() => {
    setForm({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
    })
  }, [user?.email, user?.fullName])

  function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    router.patch('/dashboard/profile', form, {
      preserveScroll: true,
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Profile</h1>
          <p className="text-sm text-muted-foreground">Lihat dan perbarui data akun pengguna.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <EditIcon data-icon="inline-start" />
          Ubah Profile
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 rounded-lg">
              <AvatarImage alt={displayName} />
              <AvatarFallback className="rounded-lg">{user?.initials ?? '--'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg">{displayName}</CardTitle>
              <CardDescription className="truncate">{user?.email ?? '-'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ProfileField icon={<UserIcon />} label="Nama Lengkap" value={displayName} />
          <ProfileField icon={<MailIcon />} label="Email" value={user?.email ?? '-'} />
          <ProfileField icon={<ShieldCheckIcon />} label="Role" value="admin" />
          <ProfileField icon={<UserIcon />} label="Initials" value={user?.initials ?? '-'} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Profile</DialogTitle>
            <DialogDescription>Perbarui nama lengkap dan email akun.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={submitProfile}>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="profile-full-name">Nama Lengkap</Label>
                <Input
                  id="profile-full-name"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  required
                />
                {errors.fullName && (
                  <div className="text-sm text-destructive">{errors.fullName}</div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
                {errors.email && <div className="text-sm text-destructive">{errors.email}</div>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}
