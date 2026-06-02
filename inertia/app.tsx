import './css/app.css'
import { type ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import { type Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TooltipProvider } from './components/ui/tooltip'
import DashboardLayout from './layouts/dashboard-layout'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'
function getLayout(name: string) {
  if (name === 'dashboard' || name.startsWith('dashboard/')) {
    return DashboardLayout
  }

  return Layout
}
createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
       const PageLayout = getLayout(name)
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) =>  <PageLayout children={page} />
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <TooltipProvider>
        <App {...props} />
        </TooltipProvider>
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
