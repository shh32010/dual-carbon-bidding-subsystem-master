<template>
  <div class="container">
    <el-breadcrumb style="margin: 10px" separator="/">
      <el-breadcrumb-item :to="{ path : '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>平台动态</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="background-color: white;padding: 20px">
      <el-table @row-click="rowClick" :data="list" :cell-style="{ padding: '20px 0' }">
        <el-table-column label="序号" type="index" prop="index" align="center"></el-table-column>
        <el-table-column label="标题" prop="title" align="left"></el-table-column>
        <el-table-column label="发布时间" prop="createTime" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
      <br>
      <el-pagination
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        :page-sizes="[5, 10, 20, 30]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

import { listInformation } from '@/api/bid/information'

export default {
  data() {
    return {
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.init()
    },
    rowClick(selection, row) {
      this.$router.push({
        path: '/info/detail',
        query: {
          id: selection.id
        }
      })
    },
    init() {
      listInformation(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      })
    }
  },
  created() {

  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
