/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/category',
  name: 'Product',
  meta: {
    title: '产品管理',
    icon: 'shopping'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/product/category/index'),
      name: 'ProdyctCategory',
      meta: { title: '分类列表' },
    },
    {
      path: 'category/create',
      component: () => import('@/views/product/category/create'),
      name: 'ProdyctCategoryCreate',
      meta: { title: '添加分类' },
      hidden: true
    },
    {
      path: 'category/edit/:id',
      component: () => import('@/views/product/category/edit'),
      name: 'ProdyctCategoryEdit',
      meta: { title: '修改分类' },
      hidden: true
    },
    {
      path: 'type',
      component: () => import('@/views/product/type/index'),
      name: 'ProductType',
      meta: { title: '产品类型' }
    },
    {
      path: 'type/attribute/:id',
      component: () => import('@/views/product/type/attribute/index'),
      name: 'ProductTypeAttribute',
      meta: { title: '产品类型属性' },
      hidden: true
    },
    {
      path: 'color',
      component: () => import('@/views/product/color/index'),
      name: 'ProductColor',
      meta: { title: '产品颜色' }
    },
    {
      path: 'list',
      component: () => import('@/views/product/product/index'),
      name: 'ProductProduct',
      meta: { title: '产品列表' },
    },
    {
      path: 'create',
      component: () => import('@/views/product/product/create'),
      name: 'ProdyctProductCreate',
      meta: { title: '添加产品' },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/product/product/edit'),
      name: 'ProdyctProductEdit',
      meta: { title: '修改产品' },
      hidden: true
    }
  ]
}
export default productRouter
