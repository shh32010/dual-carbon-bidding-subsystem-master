<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb" style="padding: 10px">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/policylaw/list">政策法规</el-breadcrumb-item>
      <el-breadcrumb-item>政策法规详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div>{{ detailData.title }}</div>
      <br>
      <div class="title">
        <small>创建时间：{{ detailData.createTime }} </small>
        <small> 企业：{{ detailData.publisher }}</small>
      </div>
      <div class="body" style="text-align: left">
        <div v-html="detailData.content"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { getInformation } from '@/api/bid/information'

export default {
  name: 'detail',
  data() {
    return {
      id: this.$route.query.id,
      detailData: {}
    }
  },
  methods: {
    getListDetail() {
      getInformation(this.id).then(res => {
        this.detailData = res.data
      })
    }
  },
  mounted() {
    this.getListDetail()
  }

}
</script>

<style lang="scss" scoped>

</style>
