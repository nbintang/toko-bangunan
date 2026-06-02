import { client } from '~/client'
import { type ReactElement } from 'react'
import Layout from '~/layouts/default'
import { type Data } from '@generated/data'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import DashboardLayout from './layouts/dashboard-layout'
function getLayout(name: string) {
  if (name === 'dashboard' || name.startsWith('dashboard/')) {
    return DashboardLayout
  }

  return Layout
}

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,

    resolve: (name) => {
      const PageLayout = getLayout(name)
        return resolvePageComponent(
          `./pages/${name}.tsx`,
          import.meta.glob('./pages/**/*.tsx', { eager: true }),
          (resolvedPage: ReactElement<Data.SharedProps>) => <PageLayout children={resolvedPage} />
        )
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      )
    },
  })
}
