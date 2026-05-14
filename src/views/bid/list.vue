<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>投标列表页</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="display: grid; grid-template-columns: repeat(4, 24%); grid-gap: 1%; padding-top: 30px;">
      <div v-for="bidding in biddingList" @click="jumpTo(bidding.id)" class="card">
        <div class="title">{{ bidding.bidTitle }}</div>
        <div class="content">{{ bidding.bidContent }}</div>
        <div class="datetime" v-html="bidding.bidPublishDatetime"></div>
      </div>
    </div>

    <FloatCard v-if="newestBidding" :bid-bidding="newestBidding" @close="newestBidding = undefined"></FloatCard>
  </div>
</template>

<script>
import { listBidding, getNewestBidding } from '@/api/bid/bidding'
import { parseTime } from '@/utils/neu'
import FloatCard from '@/views/bid/FloatCard.vue'

export default {
  name: 'detail',
  components: { FloatCard },
  data() {
    return {
      biddingList: [],
      newestBidding: undefined,
    }
  },
  async mounted() {
    this.biddingList = (await listBidding({ category: this.$route.query.category })).rows
    this.newestBidding = (await getNewestBidding()).data
  },
  methods: {
    parseTime,
    jumpTo(id) {
      this.$router.push(`/bid/detail?id=${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  background-color: #fff;
  border-radius: 12px;
  transition: 0.4s;

  .title {
    border-radius: 12px 0 0 0;
    opacity: 1;
    background: linear-gradient(90deg, #1AD0B6 0%, rgba(245, 245, 245, 0.00) 100%);
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 20px;
    color: #fff;
    font-size: 20px;
  }

  .content {
    height: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 20px;
    text-align: left;
    white-space: pre-line;
  }

  .datetime {
    color: #666;
    padding: 20px;
  }
}

.card:hover {
  transform: scale(1.05);
}
</style>
