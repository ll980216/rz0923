// 对axios二次封装
import axios from 'axios'

// 通过axios创造axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
export default service
