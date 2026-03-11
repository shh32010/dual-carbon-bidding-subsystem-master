<template>
  <div>
    <div style="padding: 20px;background-color: white">
      <el-table :cell-style="{padding: '15px 0'}" :data="tableData">
        <el-table-column label="序号" type="index" :index="forMatterIndex"/>
        <el-table-column label="名称" prop="bidTitle"/>
        <el-table-column label="结束时间" prop="endDate"/>
        <el-table-column label="状态" prop="status" :formatter="statusFormatter"/>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="submitBidFile(scope.row.id)" type="primary" v-if="parseInt(scope.row.status) === 4">
              提交资料
            </el-button>
          </template>
        </el-table-column>
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

import { listBidding } from '@/api/bid/bidding'

export default {
  name: 'myBidding',
  data() {
    return {
      tableData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      statusOption: []
    }
  },
  methods: {
    submitBidFile(val) {
      this.$router.push({
        path: '/enterprise/commitFile',
        query: {
          id: val
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
    statusFormatter(row, colum) {
      return this.selectDictLabel(this.statusOption, row.status)
    },
    getList() {
      listBidding(this.queryParams).then(res => {
        this.total = res.total
        this.tableData = res.rows
      })
    }
  },
  computed: {
    forMatterIndex() {
      return (this.queryParams.pageNum - 1) * this.queryParams.pageSize + 1
    }
  },
  mounted() {
    this.getDicts('bid_status').then(response => {
      this.statusOption = response.data
    })
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

</style>
