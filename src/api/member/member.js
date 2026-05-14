import request from '@/utils/request'

// 获取产品列表
export function productList() {
  return request({
    url: '/member/product/list',
    method: 'get'
  })
}

// 获取单个产品
export function getProduct(id) {
  return request({
    url: '/member/product/' + id,
    method: 'get'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/member/order/create',
    method: 'post',
    data
  })
}

// 模拟支付
export function payOrder(orderId, method) {
  return request({
    url: '/member/order/pay/' + orderId,
    method: 'post',
    params: { method }
  })
}

// 最近销售记录
export function recentOrders() {
  return request({
    url: '/member/order/recent',
    method: 'get'
  })
}

// AI 对话（非流式，兼容 fallback）
export function chat(prompt) {
  return request({
    url: '/member/ai/chat',
    method: 'post',
    data: prompt
  })
}

// AI 对话（流式，Ollama SSE）
export function chatStream(prompt, onMessage, onDone, onError) {
  const token = localStorage.getItem('ruoyi-token') || sessionStorage.getItem('ruoyi-token') || ''
  const url = 'http://localhost:11434/api/generate'
  const body = {
    model: 'qwen2.5:7b',
    prompt: prompt,
    stream: true
  }

  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token)

  let buffer = ''
  xhr.onprogress = () => {
    // For streaming, handle incrementally
  }

  xhr.onload = () => {
    if (xhr.status === 200) {
      if (onDone) onDone()
    } else {
      if (onError) onError('AI 服务暂时不可用')
    }
  }

  xhr.onerror = () => {
    if (onError) onError('AI 连接失败，请确保 Ollama 已启动')
  }

  xhr.send(JSON.stringify(body))
  return xhr
}
