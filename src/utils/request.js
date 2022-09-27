// 对axios二次封装
import router from '@/router'
import store from '@/store'
// import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'
const TimeOut = 3600
function IsChangeTime() {
  const newTime = Date.now()
  const curr = (newTime - store.getters.hrsassTime) / 1000
  return curr > TimeOut // true 为超时
}

// 通过axios创造axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 考虑把那些数据跑出去
  // 接口成功，并且业务成功
  // 没有成功Promise.reject抛出错误
  const { message, data, success } = response.data
  if (success) { // 业务逻辑是成功的}
    return data
  }
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  if (error.response && error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('token超时了')
  } else {
    // console.log(error1111)
    Message.error(error.message)
  }
  return Promise.reject(error)
}
)

// 请求拦截器修改
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (IsChangeTime()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
export default service
