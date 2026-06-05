'use client'

import * as React from 'react'
import { usePage } from '@inertiajs/react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  GalleryVerticalEndIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LayoutDashboard,
} from 'lucide-react'
import type { InertiaProps } from '~/types'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Beranda',
      url: '/dashboard/overview',
      icon: <LayoutDashboard />,
    },
    {
      title: 'Persediaan Barang',
      url: '/dashboard/inventory',
      icon: <BotIcon />,
    },
    {
      title: 'Master Data',
      url: '#',
      icon: <BookOpenIcon />,
      items: [
        {
          title: 'Kategori Barang',
          url: '/dashboard/master-data/category',
        },
        {
          title: 'Daftar barang',
          url: '/dashboard/master-data/items',
        },
        {
          title: 'Manajemen Pengguna',
          url: '/dashboard/master-data/users',
        },
      ],
    },
    {
      title: 'Laporan',
      url: '/dashboard/reports',
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePage<InertiaProps>().props

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         <SidebarMenu>
          <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEndIcon />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium"> Toko Olahraga</span>
            <span className="truncate text-xs">tess</span>
          </div>
        </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
