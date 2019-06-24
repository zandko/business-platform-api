import request from '@/utils/request'

export function getAdministrators(options) {
  return request({
    url: 'v1/admin/administrators',
    method: 'get',
    params: options
  })
}
