/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const articleRouter = {
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
}

export default articleRouter
