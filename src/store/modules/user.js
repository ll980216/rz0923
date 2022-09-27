import { loginAPI } from '@/api/login'
import { getInfo, getUserByID } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsassTime: 0 
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setuserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    reomveuserInfo(state) {
      state.userInfo = {}
    },
    reomvetoken(state, token) {
      state.token = null
    },
    sethrsassTime(state, time) {
      state.hrsassTime = time
    }
  },
  actions: {
    async loginActions({ commit }, loginData) {
      // 接口
      const  data = await loginAPI(loginData)
      console.log(data)
      commit('setToken', data)
      commit('sethrsassTime',+new Date())
    },
    async getasync({ commit }) {
      const res = await getInfo()
      const res1 = await getUserByID(res.userId)
      const result = {...res,...res1}
      commit('setuserInfo', result)
      return JSON.parse(JSON.stringify(result))
    },
    async logout({ commit }) {
      commit('reomveuserInfo')
      commit('reomvetoken')
    }
  }
}
