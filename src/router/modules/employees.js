import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees/index.vue'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      // 动态路由配置规则：id接收
      path: '/employees/detail/:id',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true
    },
    {
      // 打印页面
      path: '/employees/print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true
    }
  ]
}
