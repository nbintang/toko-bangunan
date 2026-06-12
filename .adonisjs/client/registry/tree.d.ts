/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: {
    index: typeof routes['dashboard.index']
    overview: typeof routes['dashboard.overview']
    inventory: {
      index: typeof routes['dashboard.inventory.index']
      transactions: {
        store: typeof routes['dashboard.inventory.transactions.store']
      }
    }
    reports: {
      index: typeof routes['dashboard.reports.index']
    }
    profile: {
      index: typeof routes['dashboard.profile.index']
      update: typeof routes['dashboard.profile.update']
      password: {
        update: typeof routes['dashboard.profile.password.update']
      }
    }
    masterData: {
      categories: {
        index: typeof routes['dashboard.master_data.categories.index']
        store: typeof routes['dashboard.master_data.categories.store']
        update: typeof routes['dashboard.master_data.categories.update']
        destroy: typeof routes['dashboard.master_data.categories.destroy']
      }
      products: {
        index: typeof routes['dashboard.master_data.products.index']
        store: typeof routes['dashboard.master_data.products.store']
        update: typeof routes['dashboard.master_data.products.update']
        destroy: typeof routes['dashboard.master_data.products.destroy']
      }
      userManagements: {
        index: typeof routes['dashboard.master_data.user_managements.index']
        store: typeof routes['dashboard.master_data.user_managements.store']
        update: typeof routes['dashboard.master_data.user_managements.update']
        destroy: typeof routes['dashboard.master_data.user_managements.destroy']
      }
    }
  }
}
