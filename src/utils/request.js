// 对axios二次封装
import store from '@/store'
import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'

// 通过axios创造axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.response.use(response => {
  try {
    const { success, message, data } = response.data
  if (success) {
    return data
  }
  Message.error.message
  return Promise.reject(new Error(message))
  } catch (error) {
  return Promise.reject(error)
  }
})
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
export default service
