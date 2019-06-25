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
      redirect: '/product/category/list',
      meta: { title: '产品分类' },
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
          meta: { title: '添加分类' }
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/product/category/edit/index'),
          name: 'ProdyctCategoryEdit',
          meta: { title: '修改分类' },
          hidden: true
        }
      ]
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
    }
  ]
}
export default productRouter
