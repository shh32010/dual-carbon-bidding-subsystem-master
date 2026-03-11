import request from '@/utils/request'

// 查询招投标列表（含分页）
export function listBidding(query) {
  return request({
    url: '/bid/bidding/front/list',
    method: 'get',
    params: query
  })
}

// 查询未报名的招投标列表（企业端）
export function listBiddingNoSignUp(query) {
  return request({
    url: '/bid/bidding/front/list/noSignUp',
    method: 'get',
    params: query
  })
}

// 查询已报名的招投标列表（企业端）
export function listBiddingSignUp(query) {
  return request({
    url: '/bid/bidding/front/list/signUp',
    method: 'get',
    params: query
  })
}

// 企业报名投标
export function enrollBidEnterprise(data) {
  return request({
    url: '/bid/enterprise/bidding/front/add',
    method: 'post',
    data: data
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
