import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { router, usePage } from '@inertiajs/react'
import { ChevronsUpDownIcon, LogOutIcon, Settings, User } from 'lucide-react'
import type { InertiaProps } from '~/types'

export function NavUser({
  user,
}: {
  user: {
    fullName: string | null
    email: string
    initials: string
  }
}) {
  const { isMobile } = useSidebar()
  const { errors } = usePage<InertiaProps>().props
  const displayName = user.fullName ?? user.email
  const [passwordOpen, setPasswordOpen] = React.useState(false)
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  })

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    router.patch('/dashboard/profile/password', passwordForm, {
      preserveScroll: true,
      onSuccess: () => {
        setPasswordOpen(false)
        setPasswordForm({
          currentPassword: '',
          password: '',
          passwordConfirmation: '',
        })
      },
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={displayName} />
                <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={displayName} />
                  <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => router.visit('/dashboard/profile')}>
                <User />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
                <Settings />
                Ganti Password
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.post('/auth/logout')}
              className="cursor-pointer"
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ganti Password</DialogTitle>
              <DialogDescription>Masukkan password lama dan password baru.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={submitPassword}>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Password Lama</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    required
                  />
                  {errors.currentPassword && (
                    <div className="text-sm text-destructive">{errors.currentPassword}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    required
                  />
                  {errors.password && (
                    <div className="text-sm text-destructive">{errors.password}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-confirmation">Konfirmasi Password Baru</Label>
                  <Input
                    id="password-confirmation"
                    type="password"
                    value={passwordForm.passwordConfirmation}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        passwordConfirmation: event.target.value,
                      }))
                    }
                    required
                  />
                  {errors.passwordConfirmation && (
                    <div className="text-sm text-destructive">{errors.passwordConfirmation}</div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
