import { loginAPI } from '@/api/login'
import { getInfo, getUserByID } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}
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
    }
  },
  actions: {
    async loginActions({ commit }, loginData) {
      // 接口
      const  data = await loginAPI(loginData)
      console.log(data)
      commit('setToken', data)
    },
    async getasync({ commit }) {
      const res = await getInfo()
      const res1 = await getUserByID(res.userId)
      const result = {...res,...res1}
      commit('setuserInfo', result)
      return JSON.parse(JSON.stringify(result))
    }
  }
}
