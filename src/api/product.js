import request from '@/utils/request'

// 产品分类
export function getProductCategory() {
  return request({
    url: 'v1/admin/product_category',
    method: 'get'
  })
}

export function fetchProductCategory(id) {
  return request({
    url: `v1/admin/product_category/${id}`,
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

// 产品类型
export function getProductType() {
  return request({
    url: 'v1/admin/product_type',
    method: 'get'
  })
}

export function fetchProductType(id) {
  return request({
    url: `v1/admin/product_type/${id}`,
    method: 'get'
  })
}

export function createProductType(data) {
  return request({
    url: 'v1/admin/product_type',
    method: 'post',
    data
  })
}

export function deleteProductType(id) {
  return request({
    url: `v1/admin/product_type/${id}`,
    method: 'delete'
  })
}

export function updateProductType(data, id) {
  return request({
    url: `v1/admin/product_type/${id}`,
    method: 'put',
    data
  })
}

// 产品类型属性
export function getProductTypeAttribute(id) {
  return request({
    url: `v1/admin/product_type_attributes/${id}`,
    method: 'get'
  })
}

export function createProductTypeAttribute(data) {
  return request({
    url: 'v1/admin/product_type_attribute',
    method: 'post',
    data
  })
}

export function deleteProductTypeAttribute(id) {
  return request({
    url: `v1/admin/product_type_attribute/${id}`,
    method: 'delete'
  })
}

export function updateProductTypeAttribute(data, id) {
  return request({
    url: `v1/admin/product_type_attribute/${id}`,
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

// 产品管理
export function getProduct(options) {
  return request({
    url: 'v1/admin/product',
    method: 'get',
    params: options
  })
}

export function fetchProduct(id) {
  return request({
    url: `v1/admin/product/${id}`,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: 'v1/admin/product',
    method: 'post',
    data
  })
}

export function updateProduct(data, id) {
  return request({
    url: `v1/admin/product/${id}`,
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `v1/admin/product/${id}`,
    method: 'delete'
  })
}
