import request from '@/utils/request'

// 产品分类
export function getProductCategory() {
  return request({
    url: 'v1/admin/product_category',
    method: 'get'
  })
}

export function createProductCategory(data) {
  return request({
    url: 'v1/admin/product_category',
    method: 'post',
    data
  })
}

export function deleteProductCategory(id) {
  return request({
    url: `v1/admin/product_category/${id}`,
    method: 'delete'
  })
}

export function updateProductCategory(data, id) {
  return request({
    url: `v1/admin/product_category/${id}`,
    method: 'put',
    data
  })
}

// 产品颜色
export function getProductColor() {
  return request({
    url: 'v1/admin/product_color',
    method: 'get'
  })
}

export function createProductColor(data) {
  return request({
    url: 'v1/admin/product_color',
    method: 'post',
    data
  })
}

export function deleteProductColor(id) {
  return request({
    url: `v1/admin/product_color/${id}`,
    method: 'delete'
  })
}

export function updateProductColor(data, id) {
  return request({
    url: `v1/admin/product_color/${id}`,
    method: 'put',
    data
  })
}
