<template>
  <div class="compare-page">
    <div class="compare-container">
      <h2 class="page-title">产品权益对比</h2>

      <div class="compare-table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="col-category">服务类别</th>
              <th class="col-item">服务项目</th>
              <th v-for="product in products" :key="product.id" class="col-product">
                <div class="product-header-cell">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">{{ product.price }}元/{{ product.period }}</div>
                  <el-button type="primary" size="small" class="buy-btn" @click="goBuy(product)">
                    立即购买
                  </el-button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- 信息服务 -->
            <tr class="tr-category">
              <td rowspan="2" class="category-cell">信息服务</td>
              <td class="item-cell">短信订阅</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasInfoPush === '1' ? '√' : '×' }}
              </td>
            </tr>
            <tr>
              <td class="item-cell">短信推送</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasSms === '1' ? '√' : '×' }}
              </td>
            </tr>

            <!-- 客服服务 -->
            <tr class="tr-category">
              <td rowspan="2" class="category-cell">客服服务</td>
              <td class="item-cell">专属人工客服</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasExclusiveService === '1' ? '√' : '×' }}
              </td>
            </tr>
            <tr>
              <td class="item-cell">电脑远程服务</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.remoteCount }}
              </td>
            </tr>

            <!-- 增值服务 -->
            <tr class="tr-category">
              <td rowspan="3" class="category-cell">增值服务</td>
              <td class="item-cell">数字证书服务</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasDigitalCert === '1' ? '√' : '×' }}
              </td>
            </tr>
            <tr>
              <td class="item-cell">商业信息服务</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasCreditReport === '1' ? '√' : '×' }}
              </td>
            </tr>
            <tr>
              <td class="item-cell">咨询评估报告</td>
              <td v-for="p in products" :key="p.id" class="value-cell center">
                {{ p.hasConsultReport === '1' ? '√' : '×' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="back-link">
        <el-button @click="router.push('/member/list')">返回会员服务</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SiteHeader from '@/layout/components/platform/Header.vue'
import SiteFooter from '@/layout/components/platform/SiteFooter.vue'
import { productList } from '@/api/member/member'

const router = useRouter()
const products = ref([])

const loadProducts = async () => {
  try {
    const res = await productList()
    if (res.code === 200) {
      products.value = res.data || []
    }
  } catch (e) {
    console.error(e)
  }
}

const goBuy = (product) => {
  router.push({ path: '/member/recharge', query: { productId: product.id } })
}

onMounted(() => {
  loadProducts()
})
</script>

<style lang="scss" scoped>
.compare-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.compare-container {
  max-width: 1100px;
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

.compare-table-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 16px 20px;
    border: 1px solid #e8e8e8;
    text-align: left;
  }

  thead th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
  }
}

.col-category {
  width: 120px;
}

.col-item {
  width: 180px;
}

.col-product {
  min-width: 180px;
  text-align: center;
}

.category-cell {
  background: #fafafa;
  font-weight: 600;
  color: #555;
  text-align: center;
  vertical-align: middle;
}

.item-cell {
  color: #444;
  font-weight: 500;
}

.value-cell {
  text-align: center;
  vertical-align: middle;

  &.center {
    font-size: 18px;
    color: #13B69F;
    font-weight: 700;
  }
}

.product-header-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .product-name {
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }

  .product-price {
    font-size: 14px;
    color: #999;
  }

  .buy-btn {
    background: #13B69F !important;
    border-color: #13B69F !important;
    border-radius: 6px;
    font-size: 13px;
  }
}

.tr-category td {
  background: #fcfcfc;
}

.back-link {
  text-align: center;
  margin-top: 30px;

  .el-button {
    padding: 12px 40px;
    font-size: 15px;
  }
}
</style>