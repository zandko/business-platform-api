/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/shop',
  component: Layout,
  redirect: '/shop/product/list',
  name: 'Shop',
  meta: {
    title: '产品管理',
    icon: 'shopping'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/product/category/index'),
      redirect: 'noRedirect',
      name: 'ProdyctCategory',
      meta: { title: '分类管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/product/category/list/index'),
          name: 'ProdyctCategoryList',
          meta: { title: '分类列表' }
        },
        {
          path: 'create',
          component: () => import('@/views/product/category/create/index'),
          name: 'ProdyctCategoryCreate',
          meta: { title: '添加分类' },
          hidden: true
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/product/category/edit/index'),
          name: 'ProdyctCategoryEdit',
          meta: { title: '修改分类', noCache: true, activeMenu: '/shop/category/list' },
          hidden: true
        }
      ]
    },
    {
      path: 'type',
      component: () => import('@/views/product/type/index'),
      redirect: 'noRedirect',
      name: 'ProductType',
      meta: { title: '产品类型管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/product/type/type/index'),
          name: 'ProductTypeList',
          meta: { title: '类型列表' }
        },
        {
          path: 'attribute/:id',
          component: () => import('@/views/product/type/attribute/index'),
          name: 'ProductTypeAttribute',
          meta: { title: '类型属性' },
          hidden: true
        }
      ]
    },
    {
      path: 'color',
      component: () => import('@/views/product/color/index'),
      name: 'ProductColor',
      meta: { title: '颜色列表' }
    },
    {
      path: 'product',
      component: () => import('@/views/product/product/index'),
      redirect: 'noRedirect',
      name: 'Product',
      meta: { title: '产品管理' },
      children: [
        {
          path: 'set_picture/:id',
          component: () => import('@/views/product/product/set_picture/index'),
          name: 'SetPicture',
          meta: { title: '图片关联' },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/product/product/list/index'),
          name: 'ProductList',
          meta: { title: '产品列表' }
        },
        {
          path: 'create',
          component: () => import('@/views/product/product/create/index'),
          name: 'ProductCreate',
          meta: { title: '添加产品' },
          hidden: true
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/product/product/edit/index'),
          name: 'ProductEdit',
          meta: { title: '修改产品', noCache: true, activeMenu: '/shop/product/list' },
          hidden: true
        }
      ]
    }
  ]
}
export default productRouter
