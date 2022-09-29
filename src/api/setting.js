import request from '@/utils/request'
export function getRolelistApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 新增接口
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'POST'
  })
}
// 编辑接口
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
// 删除接口
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 获取公司接口
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
