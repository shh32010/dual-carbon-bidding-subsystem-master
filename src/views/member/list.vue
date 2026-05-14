<template>
  <div class="list">
    <div style="display: flex; margin-bottom: 30px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>会员服务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="goods-list">
        <div class="goods-item" v-for="(item,index) in goodsList" :key="index">
          <div class="item-top">
            <img
              v-if="item.pic"
              style="width: 100%; height: 170px"
              :src="item.pic"
            />
            <img
              v-else
              style="width: 100%; height: 170px"
              src="@/assets/images/pic-cover.png"
            />
            <div class="desc">
              <div class="title">{{ item.goodsName ? item.goodsName : '--' }}</div>
              <div class="price">{{ item.price ? '¥' + item.price + '元/年' : '--' }}</div>
            </div>
          </div>
          <div class="goods-content" v-html="item.description"></div>
          <div class="pay-btn" @click="toMemberRecharge(item.goodsId,index)">
            立即购买
          </div>
        </div>
      </div>
      <div class="look-goods-compare" @click="toComparsion">
        查看产品权益对比>>
      </div>
    </div>
  </div>
</template>

<script>
import {goodsList} from '@/api/member/member'

export default {
  name: "list",
  data() {
    return {
      goodsList: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      goodsList().then(res => {
        this.goodsList = res.rows
      })
    },
    toMemberRecharge(goodsId, index) {
      this.$router.push({path: '/member/recharge', query: {goodsId, index}})
    },
    toComparsion() {
      this.$router.push(`/member/product-equity-comparison`)
    }
  },
}
</script>

<style lang="scss" scoped>
.list {
  .breadcrumb {
    height: 21px;
    font-family: MicrosoftYaHei, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0em;
    margin-left: 30px
  }

  .content {
    background: #FFFFFF;
    border-radius: 10px;
    opacity: 1;
    width: 100%;
    min-height: 860px;
  }
}

.goods-list {
  padding: 50px 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
}

.goods-list .goods-item {
  position: relative;
  height: 480px;
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.06);
  flex: 1;
  width: 300px;
  margin-right: calc((100% - 900px) / 3);
  margin-top: 30px;
  min-width: 300px;
  max-width: 300px;

  &:nth-child(3n) {
    margin-right: 0;
  }

  .item-top {
    position: relative;
  }

  .pic-icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .desc {
    width: 200px;
    position: absolute;
    top: 40px;
    left: 50%;
    margin-left: -100px;
    font-size: 32px;
    color: #FFFFFF;
    font-weight: 700;
    .title {
      font-size: 40px;
    }
  }
}

.pay-btn {
  width: 200px;
  height: 44px;
  border-radius: 4px;
  background: linear-gradient(90deg, #22CDB5 8%, #46DFCA 96%);
  font-size: 16px;
  font-weight: bold;
  line-height: 38px;
  color: #FFFFFF;
  position: absolute;
  bottom: 30px;
  left: 50%;
  margin-left: -100px;
  cursor: pointer;
}

.look-goods-compare {
  margin: 10px 200px;
  width: 80%;
  height: 60px;
  border-radius: 8px;
  background: #EAFAF8;
  box-sizing: border-box;
  border: 1px solid #7EE1D3;
  font-size: 16px;
  line-height: 60px;
  color: #13B69F;
  cursor: pointer;
}

.goods-content {
  text-align: left;
  font-size: 16px;
  line-height: 32px;
  color: #3D3D3D;
  margin-left: 30px;
}
</style>
