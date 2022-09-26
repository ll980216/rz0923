// 对axios二次封装
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
export default service
