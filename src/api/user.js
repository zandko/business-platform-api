import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v1/admin/authentications',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'v1/admin/administrator',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
