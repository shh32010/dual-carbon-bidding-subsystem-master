import request from '@/utils/request'

// 查询招投标列表
export function listBidding(query) {
  return request({
    url: '/bid/bidding/front/list',
    method: 'get',
    params: query
  })
}

// 查询招投标详细
export function getBidding(id) {
  return request({
    url: '/bid/bidding/front/' + id,
    method: 'get'
  })
}
// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}
