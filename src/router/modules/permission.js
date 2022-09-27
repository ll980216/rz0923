import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permission',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission/index.vue'),
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
