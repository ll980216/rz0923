import request from '@/utils/request'

export function login(data) {

}

export function getInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}
export const getUserByID = id => {
    return request({
       url: `/sys/user/${id}`
    })
}

export function logout() {

}
