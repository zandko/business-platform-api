/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/administrators',
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'component'
  },
  children: [
    {
      path: 'administrators',
      component: () => import('@/views/system/administrators/index'),
      name: 'Administrators',
      meta: { title: '用户管理' }
    },
    {
      path: 'roles',
      component: () => import('@/views/system/roles/index'),
      name: 'Roles',
      meta: { title: '角色管理' }
    },
    {
      path: 'privileges',
      component: () => import('@/views/system/privileges/index'),
      name: 'Privileges',
      meta: { title: '权限管理' },
      hidden: true
    }
  ]
}
export default systemRouter
