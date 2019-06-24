import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list',
    baseURL: process.env.VUE_APP_BASE_API,
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    baseURL: process.env.VUE_APP_BASE_API,
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    baseURL: process.env.VUE_APP_BASE_API,
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    baseURL: process.env.VUE_APP_BASE_API,
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    baseURL: process.env.VUE_APP_BASE_API,
    method: 'post',
    data
  })
}
