import request from '@/utils/request'

// 查询帖子列表
export function listPost(query) {
  return request({
    url: '/community/post/list',
    method: 'get',
    params: query
  })
}

// 获取帖子详情（含评论，返回结构：{ post, comments }）
export function getPost(id) {
  return request({
    url: '/community/post/' + id,
    method: 'get'
  })
}

// 发布帖子
export function addPost(data) {
  return request({
    url: '/community/post',
    method: 'post',
    data: data
  })
}

// 修改帖子
export function updatePost(data) {
  return request({
    url: '/community/post',
    method: 'put',
    data: data
  })
}

// 删除帖子
export function delPost(ids) {
  return request({
    url: '/community/post/' + ids,
    method: 'delete'
  })
}

// 点赞/取消点赞
export function toggleLike(id) {
  return request({
    url: '/community/post/like/' + id,
    method: 'post'
  })
}

// 收藏/取消收藏
export function toggleCollect(id) {
  return request({
    url: '/community/post/collect/' + id,
    method: 'post'
  })
}

// 置顶/取消置顶
export function toggleTop(id, isTop) {
  return request({
    url: '/community/post/top/' + id,
    method: 'put',
    params: { isTop }
  })
}

// ====== 评论接口 ======

// 查询评论列表（按帖子ID）
export function listComment(postId) {
  return request({
    url: '/community/post/comment/list/' + postId,
    method: 'get'
  })
}

// 发表评论
export function addComment(data) {
  return request({
    url: '/community/post/comment',
    method: 'post',
    data: data
  })
}

// 删除评论
export function delComment(ids) {
  return request({
    url: '/community/post/comment/' + ids,
    method: 'delete'
  })
}
