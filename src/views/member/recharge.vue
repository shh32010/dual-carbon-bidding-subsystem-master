<template>
  <div class="member-purchase-page">
    <div class="purchase-container">
      <h2 class="page-title">会员购买</h2>

      <!-- 产品 Tab 标签 -->
      <div class="product-tabs">
        <div v-for="product in products" :key="product.goodsId"
          :class="['product-tab', { active: selectedProduct && selectedProduct.goodsId === product.goodsId }]"
          @click="selectProduct(product)">
          <div class="tab-name">{{ product.goodsName }}</div>
          <div class="tab-price">¥{{ product.price }}/年</div>
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

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { goodsList, sumbitOrder, orderPay } from '@/api/member/member'

const route = useRoute()
const router = useRouter()

// 响应式数据
const products = ref([])
const selectedProduct = ref(null)
const payMethod = ref('alipay')
const paying = ref(false)

// 加载产品列表
const loadProducts = async () => {
  try {
    const res = await goodsList()
    products.value = res.rows || []
    if (products.value.length && !selectedProduct.value) {
      selectedProduct.value = products.value[0]
    }
  } catch (e) {
    products.value = []
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
    // 1. 创建订单（后端返回 orderId 字符串，JS Number 会丢精度，保持字符串传回）
    const createRes = await sumbitOrder({ goodsId: selectedProduct.value.goodsId })
    if (createRes.code !== 200) {
      return
    }
    // 2. 支付（paymentMethod: 1=微信 2=支付宝）
    const orderId = createRes.data
    if (!orderId) {
      ElMessage.error('创建订单失败，未获取到订单号')
      return
    }
    const payMethodCode = payMethod.value === 'wechat' ? 1 : 2
    const payRes = await orderPay({ orderId, paymentMethod: payMethodCode })
    if (payRes.code === 200) {
      ElMessage.success('购买成功！')
      router.push('/member/list')
    }
  } catch (e) {
    // 拦截器已弹过错误提示
  } finally {
    paying.value = false
  }
}

// 生命周期钩子
onMounted(async () => {
  await loadProducts()
  // 如果有传入 goodsId，默认选中
  const gid = route.query.goodsId
  if (gid) {
    const p = products.value.find(x => String(x.goodsId) === String(gid))
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

</style>