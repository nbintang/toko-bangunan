/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/auth/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'dashboard.overview': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/overview'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'dashboard.inventory.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/inventory'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['index']>>>
    }
  }
  'dashboard.inventory.transactions.store': {
    methods: ["POST"]
    pattern: '/dashboard/inventory/transactions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/stock_transaction').stockTransactionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/stock_transaction').stockTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['storeTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['storeTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.reports.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/reports'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['index']>>>
    }
  }
  'dashboard.profile.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dashboard.profile.update': {
    methods: ["PATCH"]
    pattern: '/dashboard/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.profile.password.update': {
    methods: ["PATCH"]
    pattern: '/dashboard/profile/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').updatePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').updatePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/master-data/category'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['index']>>>
    }
  }
  'dashboard.master_data.categories.store': {
    methods: ["POST"]
    pattern: '/dashboard/master-data/category'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/create_category').createCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/create_category').createCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.categories.update': {
    methods: ["PATCH"]
    pattern: '/dashboard/master-data/category/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/update_category').updateCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/update_category').updateCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/master-data/category/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/categories_controller').default['destroy']>>>
    }
  }
  'dashboard.master_data.products.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/master-data/items'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['index']>>>
    }
  }
  'dashboard.master_data.products.store': {
    methods: ["POST"]
    pattern: '/dashboard/master-data/items'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/create_product').createProductValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/create_product').createProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.products.update': {
    methods: ["PATCH"]
    pattern: '/dashboard/master-data/items/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/update_product').updateProductValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/update_product').updateProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.products.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/master-data/items/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/products_controller').default['destroy']>>>
    }
  }
  'dashboard.master_data.user_managements.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/master-data/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['index']>>>
    }
  }
  'dashboard.master_data.user_managements.store': {
    methods: ["POST"]
    pattern: '/dashboard/master-data/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').createUserManagementValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').createUserManagementValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.user_managements.update': {
    methods: ["PATCH"]
    pattern: '/dashboard/master-data/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUserManagementValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUserManagementValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.master_data.user_managements.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/master-data/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/master_data/user_managements_controller').default['destroy']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
}
