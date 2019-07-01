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
    url: `v1/admin/administrators/${id}` ,
    method: 'delete'
  })
}

export function updateAdministrators(data, id) {
  return request({
    url: `v1/admin/administrators/${id}` ,
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
