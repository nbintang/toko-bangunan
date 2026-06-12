import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.overview': { paramsTuple?: []; params?: {} }
    'dashboard.inventory.index': { paramsTuple?: []; params?: {} }
    'dashboard.inventory.transactions.store': { paramsTuple?: []; params?: {} }
    'dashboard.reports.index': { paramsTuple?: []; params?: {} }
    'dashboard.profile.index': { paramsTuple?: []; params?: {} }
    'dashboard.profile.update': { paramsTuple?: []; params?: {} }
    'dashboard.profile.password.update': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.products.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.products.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.user_managements.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.user_managements.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.user_managements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.user_managements.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.overview': { paramsTuple?: []; params?: {} }
    'dashboard.inventory.index': { paramsTuple?: []; params?: {} }
    'dashboard.reports.index': { paramsTuple?: []; params?: {} }
    'dashboard.profile.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.products.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.user_managements.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.overview': { paramsTuple?: []; params?: {} }
    'dashboard.inventory.index': { paramsTuple?: []; params?: {} }
    'dashboard.reports.index': { paramsTuple?: []; params?: {} }
    'dashboard.profile.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.products.index': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.user_managements.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard.inventory.transactions.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.products.store': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.user_managements.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'dashboard.profile.update': { paramsTuple?: []; params?: {} }
    'dashboard.profile.password.update': { paramsTuple?: []; params?: {} }
    'dashboard.master_data.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.user_managements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'dashboard.master_data.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.master_data.user_managements.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}