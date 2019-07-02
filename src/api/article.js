import request from '@/utils/request'

// 分类管理
export function getArticleCategories() {
  return request({
    url: '/v1/admin/article_categories',
    method: 'get'
  })
}

export function deleteArticleCategories(id) {
  return request({
    url: `/v1/admin/article_categories/${id}`,
    method: 'delete'
  })
}

export function updateArticleCategories(data, id) {
  return request({
    url: `/v1/admin/article_categories/${id}`,
    method: 'put',
    data
  })
}

export function createArticleCategories(data) {
  return request({
    url: '/v1/admin/article_categories',
    method: 'post',
    data
  })
}

// 文章管理
export function getArticle(options) {
  return request({
    url: '/v1/admin/articles',
    method: 'get',
    params: options
  })
}

export function fetchArticle(id) {
  return request({
    url: `/v1/admin/articles/${id}`,
    method: 'get'
  })
}

export function deleteArticle(id) {
  return request({
    url: `/v1/admin/articles/${id}`,
    method: 'delete'
  })
}

export function updateArticle(data, id) {
  return request({
    url: `/v1/admin/articles/${id}`,
    method: 'put',
    data
  })
}

export function createArticle(data) {
  return request({
    url: '/v1/admin/articles',
    method: 'post',
    data
  })
}
