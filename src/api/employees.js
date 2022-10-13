import request from '@/utils/request'
/**
* 获取员工的简单列表
* **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
export function getEmployeeInfo(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 更新用户信息
 * @param {*} data this.formData
 * @returns promise
 */
export function saveEmployeesAPI(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
/**
 * 获取员工岗位信息
 * @param {*} id
 * @returns
 */
export function getEmploeesJobInfoAPI(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

export function saveEmploeesJobInfoAPI(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
