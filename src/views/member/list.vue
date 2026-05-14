<template>
  <div class="member-list-page">
    <!-- 会员产品区 -->
    <div class="product-section">
      <h2 class="section-title">会员服务</h2>
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <!-- 背景图 + 产品名+价格 -->
          <div class="product-header" :style="getProductBg(product.name)">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ product.price }}</span>
              <span class="price-unit">/{{ product.period }}</span>
            </div>
          </div>
          <!-- 会员特权 -->
          <div class="product-privileges">
            <div class="privilege-item">
              <span class="privilege-icon">📩</span>
              <span class="privilege-text">短信推送 {{ product.smsCount }}条/月</span>
            </div>
            <div class="privilege-item">
              <span class="privilege-icon">💻</span>
              <span class="privilege-text">电脑远程桌面服务 {{ product.remoteCount }}次/年</span>
            </div>
            <div class="privilege-item">
              <span class="privilege-icon">🎧</span>
              <span class="privilege-text">专属人工服务</span>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="product-footer">
            <el-button type="primary" class="buy-btn" @click="handleBuy(product)">
              立即购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- 权益对比链接 -->
      <div class="compare-link">
        <el-link type="primary" :underline="false" @click="router.push('/member/product-equity-comparison')">
          【查看产品权益对比】
        </el-link>
      </div>
    </div>

    <DragButton/>

    
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DragButton  from '@/components/DragButton/index.vue'
import { productList, chat } from '@/api/member/member'
import { getToken } from "@/utils/auth"

const router = useRouter()

// 响应式数据
const products = ref([])
const showAiChat = ref(false)
const aiInput = ref('')
const aiMessages = ref([])
const aiLoading = ref(false)
const msgContainer = ref(null)

// 加载产品列表
const loadProducts = async () => {
  try {
    const res = await productList()
    if (res.code === 200) {
      products.value = res.data || []
    }
  } catch (e) {
    console.error('加载产品失败', e)
  }
}

// 获取产品背景样式
const getProductBg = (name) => {
  const bgMap = {
    'VIP1': 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'VIP2': 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'VIP3': 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
  return bgMap[name] || 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// 处理购买按钮点击
const handleBuy = (product) => {
  const token = getToken()
  console.log(token)
  if (!token) {
    ElMessage.warning('请先登录后再购买会员')
    router.push({ path: '/login', query: { redirect: '/member/recharge?productId=' + product.id } })
    return
  }
  router.push({ path: '/member/recharge', query: { productId: product.id } })
}

// 发送 AI 消息
const sendAiMessage = async () => {
  const text = aiInput.value.trim()
  if (!text || aiLoading.value) return
  
  aiMessages.value.push({ role: 'user', content: text })
  aiInput.value = ''
  aiLoading.value = true
  scrollToBottom()

  try {
    const res = await chat(text)
    if (res.code === 200) {
      aiMessages.value.push({ role: 'ai', content: res.data || '抱歉，暂未获取到回答。' })
    } else {
      aiMessages.value.push({ role: 'ai', content: res.msg || 'AI 服务暂时不可用。' })
    }
  } catch (e) {
    aiMessages.value.push({ role: 'ai', content: 'AI 连接失败，请确保 Ollama 已启动（localhost:11434）。' })
  } finally {
    aiLoading.value = false
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}

// 生命周期钩子
onMounted(() => {
  loadProducts()
})
</script>

<style lang="scss" scoped>
.member-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.product-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 40px;
  font-weight: 600;
}

.product-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.product-card {
  width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
}

.product-header {
  padding: 30px 20px;
  color: #fff;
  text-align: center;
}

.product-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.product-price {
  .price-symbol {
    font-size: 20px;
  }

  .price-value {
    font-size: 36px;
    font-weight: 700;
  }

  .price-unit {
    font-size: 14px;
    opacity: 0.85;
  }
}

.product-privileges {
  padding: 20px;
  flex: 1;
}

.privilege-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .privilege-icon {
    margin-right: 10px;
    font-size: 16px;
  }
}

.product-footer {
  padding: 20px;
}

.buy-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: #13B69F !important;
  border-color: #13B69F !important;

  &:hover {
    background: #0fa393 !important;
    border-color: #0fa393 !important;
  }
}

.compare-link {
  text-align: center;
  margin-top: 30px;
  font-size: 16px;
}

// AI 悬浮按钮
.ai-float-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  z-index: 1000;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.08);
  }

  .ai-icon {
    font-size: 24px;
  }

  .ai-text {
    font-size: 11px;
    color: #fff;
    margin-top: 2px;
    font-weight: 600;
  }
}

// AI 对话弹窗
.ai-chat-dialog {
  .ai-chat-body {
    display: flex;
    flex-direction: column;
    height: 420px;
  }
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
}

.ai-message {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;

  &.user {
    align-items: flex-end;

    .msg-label {
      color: #13B69F;
    }
  }

  &.ai {
    align-items: flex-start;

    .msg-label {
      color: #667eea;
    }
  }

  .msg-label {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .msg-content {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    white-space: pre-wrap;
    word-break: break-word;
  }

  &.user .msg-content {
    background: #13B69F;
    color: #fff;
  }

  &.typing .msg-content {
    color: #999;
    font-style: italic;
  }

  .dots {
    animation: blink 1.2s infinite;
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

.ai-input-row {
  display: flex;
  gap: 10px;

  .el-input {
    flex: 1;
  }
}
</style>