import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'setting',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/setting/index.vue'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
