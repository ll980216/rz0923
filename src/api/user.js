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
/**
 * 修改用户信息
 * @param {Object} data {}
 * @returns 默认返回promise
 */
export const saveUserByID = data => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
export function logout() {

}
