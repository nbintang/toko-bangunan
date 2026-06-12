import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', ({ response }) => response.redirect().toRoute('session.create')).as('home')

/**
 * Guest routes
 */
router
  .group(() => {
    router.get('/signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('/signup', [controllers.NewAccount, 'store']).as('new_account.store')

    router.get('/login', [controllers.Session, 'create']).as('session.create')
    router.post('/login', [controllers.Session, 'store']).as('session.store')
  })
  .prefix('/auth')
  .use(middleware.guest())

/**
 * Auth routes
 */
router
  .group(() => {
    router.get('/', ({ response }) => response.redirect().toRoute('dashboard.overview')).as('index')
    router.get('/overview', [controllers.Dashboard, 'index']).as('overview')
    router.get('/inventory', [controllers.Inventory, 'index']).as('inventory.index')
    router
      .post('/inventory/transactions', [controllers.Inventory, 'storeTransaction'])
      .as('inventory.transactions.store')
    router.get('/reports', [controllers.Reports, 'index']).as('reports.index')
    router.on('/profile').renderInertia('dashboard/profile/index', {}).as('profile.index')
    router.patch('/profile', [controllers.Profile, 'update']).as('profile.update')
    router
      .patch('/profile/password', [controllers.Profile, 'updatePassword'])
      .as('profile.password.update')

    /**
     * Master Data routes
     */
    router
      .group(() => {
        /**
         * Categories
         */
        router
          .group(() => {
            router.get('/', [controllers.masterData.Categories, 'index']).as('index')
            router.post('/', [controllers.masterData.Categories, 'store']).as('store')
            router.patch('/:id', [controllers.masterData.Categories, 'update']).as('update')
            router.delete('/:id', [controllers.masterData.Categories, 'destroy']).as('destroy')
          })
          .prefix('/category')
          .as('categories')

        /**
         * Products / Items
         */
        router
          .group(() => {
            router.get('/', [controllers.masterData.Products, 'index']).as('index')
            router.post('/', [controllers.masterData.Products, 'store']).as('store')
            router.patch('/:id', [controllers.masterData.Products, 'update']).as('update')
            router.delete('/:id', [controllers.masterData.Products, 'destroy']).as('destroy')
          })
          .prefix('/items')
          .as('products')

        /**
         * User Management
         */
        router
          .group(() => {
            router.get('/', [controllers.masterData.UserManagements, 'index']).as('index')
            router.post('/', [controllers.masterData.UserManagements, 'store']).as('store')
            router.patch('/:id', [controllers.masterData.UserManagements, 'update']).as('update')
            router.delete('/:id', [controllers.masterData.UserManagements, 'destroy']).as('destroy')
          })
          .prefix('/users')
          .as('user_managements')
      })
      .prefix('/master-data')
      .as('master_data')
  })
  .prefix('/dashboard')
  .as('dashboard')
  .use(middleware.auth())

router
  .post('/auth/logout', [controllers.Session, 'destroy'])
  .as('session.destroy')
  .use(middleware.auth())
