import request from '@/utils/request'

// 管理员管理
export function getAdministrators() {
  return request({
    url: 'v1/admin/administrators',
    method: 'get'
  })
}

export function createAdministrators(data) {
  return request({
    url: 'v1/admin/administrators',
    method: 'post',
    data
  })
}

export function deleteAdministrators(id) {
  return request({
    url: `v1/admin/administrators/${id}`,
    method: 'delete'
  })
}

export function updateAdministrators(data, id) {
  return request({
    url: `v1/admin/administrators/${id}`,
    method: 'put',
    data
  })
}

// 角色管理
export function getRoles() {
  return request({
    url: 'v1/admin/roles',
    method: 'get'
  })
}

export function createRoles(data) {
  return request({
    url: 'v1/admin/roles',
    method: 'post',
    data
  })
}

export function updateRoles(data, id) {
  return request({
    url: `v1/admin/roles/${id}`,
    method: 'put',
    data
  })
}

export function deleteRoles(id) {
  return request({
    url: `v1/admin/roles/${id}`,
    method: 'delete'
  })
}

// 权限管理
export function getPrivileges(options) {
  return request({
    url: 'v1/admin/privileges',
    method: 'get',
    params: options
  })
}

export function createPrivileges(data) {
  return request({
    url: 'v1/admin/privileges',
    method: 'post',
    data
  })
}

export function updatePrivileges(data, id) {
  return request({
    url: `v1/admin/privileges/${id}`,
    method: 'put',
    data
  })
}

export function deletePrivileges(id) {
  return request({
    url: `v1/admin/privileges/${id}`,
    method: 'delete'
  })
}
