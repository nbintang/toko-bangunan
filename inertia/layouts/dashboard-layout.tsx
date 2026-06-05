import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'

const breadcrumbLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'inventory': 'Persediaan Barang',
  'master-data': 'Master Data',
  'category': 'Kategori Barang',
  'items': 'Daftar Barang',
  'users': 'Manajemen Pengguna',
  'reports': 'Laporan',
  'profile': 'Profil',
}

const navigablePaths = new Set([
  '/dashboard/overview',
  '/dashboard/inventory',
  '/dashboard/master-data/category',
  '/dashboard/master-data/items',
  '/dashboard/master-data/users',
  '/dashboard/reports',
  '/dashboard/profile',
])

function getPath(url: string) {
  return url.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
}

function toTitle(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getBreadcrumbs(url: string) {
  const path = getPath(url)

  if (path === '/dashboard/overview' || path === '/dashboard') {
    return [{ title: 'Dashboard', href: '/dashboard/overview' }]
  }

  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard/overview' }]

  segments.slice(1).forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 2).join('/')}`

    breadcrumbs.push({
      title: breadcrumbLabels[segment] ?? toTitle(segment),
      href: navigablePaths.has(href) ? href : '',
    })
  })

  return breadcrumbs
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { url } = usePage()
  const breadcrumbs = getBreadcrumbs(url)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                  const isCurrent = index === breadcrumbs.length - 1

                  return (
                    <div key={`${breadcrumb.title}-${index}`} className="contents">
                      {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                      <BreadcrumbItem className={isCurrent ? '' : 'hidden md:block'}>
                        {isCurrent ? (
                          <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                        ) : breadcrumb.href ? (
                          <BreadcrumbLink asChild>
                            <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink asChild>
                            <span>{breadcrumb.title}</span>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
