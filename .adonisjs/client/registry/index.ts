/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/auth/signup',
    tokens: [{"old":"/auth/signup","type":0,"val":"auth","end":""},{"old":"/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/auth/signup',
    tokens: [{"old":"/auth/signup","type":0,"val":"auth","end":""},{"old":"/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'dashboard.overview': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/overview',
    tokens: [{"old":"/dashboard/overview","type":0,"val":"dashboard","end":""},{"old":"/dashboard/overview","type":0,"val":"overview","end":""}],
    types: placeholder as Registry['dashboard.overview']['types'],
  },
  'dashboard.inventory.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/inventory',
    tokens: [{"old":"/dashboard/inventory","type":0,"val":"dashboard","end":""},{"old":"/dashboard/inventory","type":0,"val":"inventory","end":""}],
    types: placeholder as Registry['dashboard.inventory.index']['types'],
  },
  'dashboard.inventory.transactions.store': {
    methods: ["POST"],
    pattern: '/dashboard/inventory/transactions',
    tokens: [{"old":"/dashboard/inventory/transactions","type":0,"val":"dashboard","end":""},{"old":"/dashboard/inventory/transactions","type":0,"val":"inventory","end":""},{"old":"/dashboard/inventory/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['dashboard.inventory.transactions.store']['types'],
  },
  'dashboard.reports.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/reports',
    tokens: [{"old":"/dashboard/reports","type":0,"val":"dashboard","end":""},{"old":"/dashboard/reports","type":0,"val":"reports","end":""}],
    types: placeholder as Registry['dashboard.reports.index']['types'],
  },
  'dashboard.profile.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/profile',
    tokens: [{"old":"/dashboard/profile","type":0,"val":"dashboard","end":""},{"old":"/dashboard/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['dashboard.profile.index']['types'],
  },
  'dashboard.profile.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/profile',
    tokens: [{"old":"/dashboard/profile","type":0,"val":"dashboard","end":""},{"old":"/dashboard/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['dashboard.profile.update']['types'],
  },
  'dashboard.profile.password.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/profile/password',
    tokens: [{"old":"/dashboard/profile/password","type":0,"val":"dashboard","end":""},{"old":"/dashboard/profile/password","type":0,"val":"profile","end":""},{"old":"/dashboard/profile/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['dashboard.profile.password.update']['types'],
  },
  'dashboard.master_data.categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/master-data/category',
    tokens: [{"old":"/dashboard/master-data/category","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/category","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/category","type":0,"val":"category","end":""}],
    types: placeholder as Registry['dashboard.master_data.categories.index']['types'],
  },
  'dashboard.master_data.categories.store': {
    methods: ["POST"],
    pattern: '/dashboard/master-data/category',
    tokens: [{"old":"/dashboard/master-data/category","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/category","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/category","type":0,"val":"category","end":""}],
    types: placeholder as Registry['dashboard.master_data.categories.store']['types'],
  },
  'dashboard.master_data.categories.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/master-data/category/:id',
    tokens: [{"old":"/dashboard/master-data/category/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/category/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/category/:id","type":0,"val":"category","end":""},{"old":"/dashboard/master-data/category/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.categories.update']['types'],
  },
  'dashboard.master_data.categories.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/master-data/category/:id',
    tokens: [{"old":"/dashboard/master-data/category/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/category/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/category/:id","type":0,"val":"category","end":""},{"old":"/dashboard/master-data/category/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.categories.destroy']['types'],
  },
  'dashboard.master_data.products.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/master-data/items',
    tokens: [{"old":"/dashboard/master-data/items","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/items","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['dashboard.master_data.products.index']['types'],
  },
  'dashboard.master_data.products.store': {
    methods: ["POST"],
    pattern: '/dashboard/master-data/items',
    tokens: [{"old":"/dashboard/master-data/items","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/items","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['dashboard.master_data.products.store']['types'],
  },
  'dashboard.master_data.products.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/master-data/items/:id',
    tokens: [{"old":"/dashboard/master-data/items/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/items/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/items/:id","type":0,"val":"items","end":""},{"old":"/dashboard/master-data/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.products.update']['types'],
  },
  'dashboard.master_data.products.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/master-data/items/:id',
    tokens: [{"old":"/dashboard/master-data/items/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/items/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/items/:id","type":0,"val":"items","end":""},{"old":"/dashboard/master-data/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.products.destroy']['types'],
  },
  'dashboard.master_data.user_managements.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/master-data/users',
    tokens: [{"old":"/dashboard/master-data/users","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/users","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['dashboard.master_data.user_managements.index']['types'],
  },
  'dashboard.master_data.user_managements.store': {
    methods: ["POST"],
    pattern: '/dashboard/master-data/users',
    tokens: [{"old":"/dashboard/master-data/users","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/users","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['dashboard.master_data.user_managements.store']['types'],
  },
  'dashboard.master_data.user_managements.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/master-data/users/:id',
    tokens: [{"old":"/dashboard/master-data/users/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/users/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/users/:id","type":0,"val":"users","end":""},{"old":"/dashboard/master-data/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.user_managements.update']['types'],
  },
  'dashboard.master_data.user_managements.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/master-data/users/:id',
    tokens: [{"old":"/dashboard/master-data/users/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/master-data/users/:id","type":0,"val":"master-data","end":""},{"old":"/dashboard/master-data/users/:id","type":0,"val":"users","end":""},{"old":"/dashboard/master-data/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.master_data.user_managements.destroy']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/auth/logout',
    tokens: [{"old":"/auth/logout","type":0,"val":"auth","end":""},{"old":"/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
