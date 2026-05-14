<template>
  <div class="member-purchase-page">
    <div class="purchase-container">
      <h2 class="page-title">会员购买</h2>

      <!-- 产品 Tab 标签 -->
      <div class="product-tabs">
        <div v-for="product in products" :key="product.id"
          :class="['product-tab', { active: selectedProduct && selectedProduct.id === product.id }]"
          @click="selectProduct(product)">
          <div class="tab-name">{{ product.name }}</div>
          <div class="tab-price">¥{{ product.price }}/{{ product.period }}</div>
          <div class="tab-tip">温馨提示:到期后不会自动续费</div>
        </div>
      </div>

      <!-- 选中产品的特权 -->
      <div v-if="selectedProduct" class="privilege-section">
        <h3 class="sub-title">会员特权</h3>
        <div class="privilege-tags">
          <div class="priv-tag">
            <span class="priv-icon">📩</span>
            <span class="priv-label">短信推送</span>
            <span class="priv-value">{{ selectedProduct.smsCount }}条/月</span>
          </div>
          <div class="priv-tag">
            <span class="priv-icon">💻</span>
            <span class="priv-label">电脑远程服务</span>
            <span class="priv-value">{{ selectedProduct.remoteCount }}次/年</span>
          </div>
          <div class="priv-tag">
            <span class="priv-icon">🎧</span>
            <span class="priv-label">专属人工客服</span>
            <span class="priv-value">有</span>
          </div>
          <div v-if="selectedProduct.hasDigitalCert === '1'" class="priv-tag">
            <span class="priv-icon">🔐</span>
            <span class="priv-label">数字证书服务</span>
            <span class="priv-value">证书办理</span>
          </div>
          <div v-if="selectedProduct.hasCreditReport === '1'" class="priv-tag">
            <span class="priv-icon">📊</span>
            <span class="priv-label">商业信息服务</span>
            <span class="priv-value">信用信息报告</span>
          </div>
          <div v-if="selectedProduct.hasConsultReport === '1'" class="priv-tag">
            <span class="priv-icon">📋</span>
            <span class="priv-label">咨询评估报告</span>
            <span class="priv-value">有</span>
          </div>
          <div v-if="selectedProduct.hasInfoPush === '1'" class="priv-tag">
            <span class="priv-icon">🔔</span>
            <span class="priv-label">信息推送服务</span>
            <span class="priv-value">短信订阅</span>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div v-if="selectedProduct" class="pay-section">
        <h3 class="sub-title">支付方式</h3>
        <div class="pay-methods">
          <div :class="['pay-method', { active: payMethod === 'alipay' }]" @click="payMethod = 'alipay'">
            <span class="pay-icon">💙</span>
            <span>支付宝付款</span>
          </div>
          <div :class="['pay-method', { active: payMethod === 'wechat' }]" @click="payMethod = 'wechat'">
            <span class="pay-icon">💚</span>
            <span>微信付款</span>
          </div>
        </div>

        <div class="pay-action">
          <el-button type="primary" class="pay-btn" :loading="paying" @click="handlePay">
            确认支付 ¥{{ selectedProduct ? selectedProduct.price : 0 }}
          </el-button>
        </div>
      </div>

      <!-- 最近销售记录 -->
      <div class="sales-section">
        <h3 class="sub-title">最近10条产品销售记录</h3>
        <el-table :data="salesRecords" border stripe>
          <el-table-column label="企业名称" prop="enterpriseName" min-width="200" />
          <el-table-column label="购买时间" prop="payTime" min-width="180">
            <template #default="{ row }">
              {{ formatTime(row.payTime) }}
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" />
        </el-table>
      </div>
    </div>

    <!-- AI 对话悬浮按钮 -->
    <div class="ai-float-btn" @click="showAiChat = true">
      <span class="ai-icon">🤖</span>
      <span class="ai-text">AI对话</span>
    </div>

    <!-- AI 对话弹窗 -->
    <el-dialog v-model="showAiChat" title="AI 智能助手" width="680px" :close-on-click-modal="false" class="ai-chat-dialog">
      <div class="ai-chat-body">
        <div class="ai-messages" ref="msgContainer">
          <div v-for="(msg, index) in aiMessages" :key="index" :class="['ai-message', msg.role]">
            <div class="msg-label">{{ msg.role === 'ai' ? '🤖 AI' : '🙋 您' }}</div>
            <div class="msg-content">{{ msg.content }}</div>
          </div>
          <div v-if="aiLoading" class="ai-message ai typing">
            <div class="msg-label">🤖 AI</div>
            <div class="msg-content">思考中<span class="dots">...</span></div>
          </div>
        </div>
        <div class="ai-input-row">
          <el-input v-model="aiInput" placeholder="请输入您的问题..." :disabled="aiLoading" @keyup.enter="sendAiMessage" />
          <el-button type="primary" :disabled="aiLoading || !aiInput.trim()" @click="sendAiMessage">提问</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SiteHeader from '@/layout/components/platform/Header.vue'
import SiteFooter from '@/layout/components/platform/SiteFooter.vue'
import { productList, recentOrders, createOrder, payOrder, chat } from '@/api/member/member'

const route = useRoute()
const router = useRouter()

// 响应式数据
const products = ref([])
const selectedProduct = ref(null)
const payMethod = ref('alipay')
const salesRecords = ref([])
const paying = ref(false)
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
      if (products.value.length && !selectedProduct.value) {
        selectedProduct.value = products.value[0]
      }
    }
  } catch (e) {
    console.error(e)
  }
}

// 加载销售记录
const loadSales = async () => {
  try {
    const res = await recentOrders()
    if (res.code === 200) {
      salesRecords.value = (res.data || []).slice(0, 10)
    }
  } catch (e) {
    console.error(e)
  }
}

// 选择产品
const selectProduct = (product) => {
  selectedProduct.value = product
}

// 处理支付
const handlePay = async () => {
  if (!selectedProduct.value) return
  paying.value = true
  try {
    // 1. 创建订单
    const createRes = await createOrder({ id: selectedProduct.value.id })
    if (createRes.code !== 200) {
      ElMessage.error(createRes.msg || '创建订单失败')
      return
    }
    const order = createRes.data
    // 2. 模拟支付
    const payRes = await payOrder(order.id, payMethod.value)
    if (payRes.code === 200) {
      ElMessage.success('购买成功！')
      // 刷新销售记录
      await loadSales()
      router.push('/member/list')
    } else {
      ElMessage.error(payRes.msg || '支付失败')
    }
  } catch (e) {
    ElMessage.error('操作异常：' + e.message)
  } finally {
    paying.value = false
  }
}

// 格式化时间
const formatTime = (t) => {
  if (!t) return '-'
  return t.replace('T', ' ').substring(0, 19)
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
    aiMessages.value.push({ role: 'ai', content: res.code === 200 ? (res.data || '无回答') : (res.msg || 'AI 不可用') })
  } catch (e) {
    aiMessages.value.push({ role: 'ai', content: 'AI 连接失败，请确保 Ollama 已启动。' })
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
onMounted(async () => {
  await loadProducts()
  await loadSales()
  // 如果有传入 productId，默认选中
  const pid = route.query.productId
  if (pid) {
    const p = products.value.find(x => String(x.id) === String(pid))
    if (p) selectedProduct.value = p
  }
})
</script>

<style lang="scss" scoped>
.member-purchase-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.purchase-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 40px;
  font-weight: 600;
}

.sub-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #13B69F;
}

// 产品 Tab
.product-tabs {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.product-tab {
  width: 280px;
  padding: 20px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &.active {
    border-color: #13B69F;
    box-shadow: 0 4px 16px rgba(19, 182, 159, 0.25);
  }

  &:hover {
    border-color: #13B69F;
  }
}

.tab-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.tab-price {
  font-size: 22px;
  color: #13B69F;
  font-weight: 700;
  margin-bottom: 8px;
}

.tab-tip {
  font-size: 11px;
  color: #999;
}

// 特权
.privilege-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.privilege-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.priv-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f0fdfb;
  border: 1px solid #b2f0eb;
  border-radius: 20px;
  font-size: 14px;
  color: #333;

  .priv-icon {
    font-size: 16px;
  }

  .priv-value {
    color: #13B69F;
    font-weight: 600;
  }
}

// 支付
.pay-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.pay-methods {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.pay-method {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;

  &.active {
    border-color: #13B69F;
    background: #f0fdfb;
    color: #13B69F;
    font-weight: 600;
  }

  &:hover {
    border-color: #13B69F;
  }

  .pay-icon {
    font-size: 20px;
  }
}

.pay-action {
  text-align: right;
}

.pay-btn {
  height: 48px;
  padding: 0 60px;
  font-size: 18px;
  border-radius: 8px;
  background: #13B69F !important;
  border-color: #13B69F !important;
}

// 销售记录
.sales-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

.ai-chat-dialog .ai-chat-body {
  display: flex;
  flex-direction: column;
  height: 420px;
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