import { loginAPI } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginActions({ commit }, loginData) {
      // 接口
      const  data = await loginAPI(loginData)
      console.log(data)
      commit('setToken', data)
    }
  }
}
