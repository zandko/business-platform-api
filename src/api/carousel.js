import request from '@/utils/request'

// 管理员管理
export function getCarousel() {
  return request({
    url: 'v1/admin/carousel',
    method: 'get'
  })
}

export function createCarousel(data) {
  return request({
    url: 'v1/admin/carousel',
    method: 'post',
    data
  })
}

export function deleteCarousel(id) {
  return request({
    url: `v1/admin/carousel/${id}`,
    method: 'delete'
  })
}

export function updateCarousel(data, id) {
  return request({
    url: `v1/admin/carousel/${id}`,
    method: 'put',
    data
  })
}
