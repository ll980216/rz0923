import Layout from '@/layout'
export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/approvals/index.vue'),
      meta: {
        title: '员工管理',
        icon: 'tree-table'
      }
    }
  ]
}
