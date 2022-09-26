import router from "@/router"
import store from "./store"
const whileList = ['/login','/404']

// 权限设置
router.beforeEach(async(to, from, next) => {
    //判断是否存在token
    if (store.getters.token) {
        if (!store.state.user.userInfo.userId) {
            await store.dispatch('user/getasync')
        }
        if (to.path === '/login') {
            next('/')
        } else {
            //放行
            next()
        }
    } else {
        // 否则不存在token 判断是否存在白名单中
        // 去往的页面是否存在在白名单中，在就直接跳转
        if (whileList.includes(to.path)) {
            next()
        } else {
            // 不在白名单放行中 跳转login
            next('/login')
        }
}
})
