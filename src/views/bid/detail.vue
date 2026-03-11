<template>
  <div class="bid-detail">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/bid/list' }">招投标</el-breadcrumb-item>
      <el-breadcrumb-item>招投标详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="content" v-loading="loading">
      <div v-if="bid">
        <h2 class="title">{{ bid.bidTitle }}</h2>
        <p class="meta">
          发布单位：{{ bid.bidPublisher || '未知' }}
          &nbsp;|&nbsp;
          发布时间：{{ parseTime(bid.bidPublishDatetime, '{y}-{m}-{d} {h}:{i}') }}
          &nbsp;|&nbsp;
          结束时间：{{ parseTime(bid.endDate || bid.bidPublishDatetime, '{y}-{m}-{d}') }}
        </p>
        <div class="description" v-if="bid.bidContent" v-html="bid.bidContent"></div>
        <div class="empty" v-else>暂无招标内容。</div>
      </div>
      <div v-else>正在加载招投标详情...</div>
    </div>
  </div>
</template>

<script>
import { getBidding } from '@/api/bid/bidding'

export default {
  name: 'detail',
  data() {
    return {
      bid: null,
      loading: false
    }
  },
  methods: {
    loadDetail() {
      const id = this.$route.query.id || this.$route.params.id
      if (!id) {
        this.$message.error('缺少招投标ID，无法获取详情')
        return
      }
      this.loading = true
      getBidding(id)
        .then(res => {
          this.bid = res.data || res
        })
        .catch(() => {
          this.$message.error('获取招投标详情失败')
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.loadDetail()
  }
}
</script>

<style lang="scss" scoped>
.bid-detail {
  .breadcrumb {
    margin: 10px 0;
  }
  .content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    min-height: 300px;
  }
  .title {
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: bold;
  }
  .meta {
    color: #909399;
    margin-bottom: 12px;
  }
  .description {
    line-height: 1.8;
    color: #333;
  }
  .empty {
    color: #999;
  }
}
</style>
