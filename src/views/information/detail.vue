<template>
  <div class="container">
    <el-breadcrumb style="margin: 10px" separator="/" class="breadcrumb">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/info/list">平台动态</el-breadcrumb-item>
      <el-breadcrumb-item>动态详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="title">{{ content.title }}</div><br>
      <div class="publish">
        <small>发布企业:{{ content.publisher }} </small>
        <small> 发布时间:{{ content.publishDatetime }}</small>
      </div>
      <div class="publishContent" v-html="content.content">
      </div>
    </div>
  </div>
</template>

<script>

import { getInformation } from '@/api/bid/information'

export default {
  data() {
    return {
      content: {}
    }
  },
  methods: {
    init() {
      getInformation(this.$route.query.id).then(res => {
        this.content = res.data
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.publishContent{
  text-align: left;
}
</style>
