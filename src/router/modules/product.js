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
      meta: { title: '产品分类' }
    },
    {
      path: 'type',
      component: () => import('@/views/product/type/index'),
      name: 'ProductType',
      meta: { title: '产品类型' }
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
