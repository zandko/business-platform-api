import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
import systemRouter from './modules/system'
import productRouter from './modules/product'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/carousel',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/carousel/index'),
        name: 'Carousel',
        meta: { title: '轮播图管理', icon: 'example' }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/example',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Example',
    meta: {
      title: '文章管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/example/category/index'),
        name: 'ArticleCategory',
        meta: { title: '文章分类' }
      },
      {
        path: 'article',
        component: () => import('@/views/example/article/index'),
        redirect: 'noRedirect',
        name: 'Article',
        meta: { title: '文章管理' },
        children: [
          {
            path: 'create',
            component: () => import('@/views/example/article/create/index'),
            name: 'CreateArticle',
            meta: { title: '创建文章' },
            hidden: true
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/example/article/edit/index'),
            name: 'EditArticle',
            meta: { title: '修改文章', noCache: true, activeMenu: '/example/article/list' },
            hidden: true
          },
          {
            path: 'list',
            component: () => import('@/views/example/article/list/index'),
            name: 'ArticleList',
            meta: { title: '文章列表' }
          }
        ]
      }
    ]
  },
  // componentsRouter,
  productRouter,
  systemRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
