<template>
  <div class="container">
    <el-breadcrumb separator="/" class="breadcrumb" style="padding: 10px">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>政策法规</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding: 20px;background-color: white">
      <el-table :cell-style="{ padding: '20px 0' }" @row-click="handleRowChange" :data="tableData">
        <el-table-column type="index" prop="index" label="序号"/>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="createTime" label="创建时间"/>
      </el-table>
      <br>
      <el-pagination
        v-show="tableData.length > 0"
        :pageSize="queryParams.pageSize"
        :currentPage="queryParams.pageNum"
        :total="total"
        :page-sizes="[5,10,20,30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes,prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script>

import { listInformation } from '@/api/bid/information'

export default {
  name: 'list',
  data() {
    return {
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleRowChange(row, colum) {
      console.log(row, colum)
      this.$router.push({
        path: '/policylaw/detail',
        query: {
          id: row.id
        }
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    getList() {
      listInformation(this.queryParams).then(res => {
        this.total = res.total
        this.tableData = res.rows
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
