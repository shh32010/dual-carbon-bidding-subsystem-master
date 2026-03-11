<template>
  <div class="enterprise-bidding">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>参与投标</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-table
        class="bidTable"
        v-loading="loading"
        style="width: 100%"
        :data="biddingList"
        :header-cell-style="{
          background: '#F6FDFD',
          height: '46px',
          color: '#000000',
          border: '0px solid tan',
          boxShadow: 'inset 0px -1px 0px 0px #EEEEEE'
        }"
        :row-style="{ height: '50px' }"
      >
        <el-table-column label="序号" type="index" width="70" />
        <el-table-column label="标的发布名称" align="left" prop="bidTitle">
          <template slot-scope="scope">
            <el-link type="primary" @click.stop.prevent="openDetail(scope.row)">
              {{ scope.row.bidTitle }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="left" prop="endDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate || scope.row.bidPublishDatetime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop.prevent="confirmEnroll(scope.row)">报名</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div ref="mobileList" class="mobileList">
        <div
          class="mobile_item"
          v-for="(item, index) in biddingList"
          :key="index"
        >
          <h4 @click="openDetail(item)">{{ item.bidTitle }}</h4>
          <span>{{ parseTime(item.endDate || item.bidPublishDatetime, '{y}-{m}-{d}') }}</span>
          <el-button type="primary" size="mini" @click="confirmEnroll(item)">报名</el-button>
        </div>
      </div>

      <pagination
        class="bidPagination"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { listBiddingNoSignUp, enrollBidEnterprise } from '@/api/bid/bidding'

export default {
  name: 'bidding',
  data() {
    return {
      loading: false,
      total: 0,
      biddingList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listBiddingNoSignUp(this.queryParams)
        .then(res => {
          this.biddingList = res.rows || []
          this.total = res.total || 0
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDetail(row) {
      if (!row || !row.id) {
        this.msgError('投标ID不存在，无法打开详情')
        return
      }
      // 兼容 history/hash 模式
      const base = window.location.href.includes('#') ? `${window.location.origin}/#` : window.location.origin
      const url = `${base}/bid/detail?id=${row.id}`
      window.open(url, '_blank')
    },
    confirmEnroll(row) {
      this.$confirm('是否确认报名该标的？', '报名确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          enrollBidEnterprise({ bidId: row.id }).then(() => {
            this.msgSuccess('报名成功')
            this.getList() // 刷新可投标列表
          }).catch(err => {
            console.error(err)
            this.msgError('报名失败，请重试')
          })
        })
        .catch(() => {
          // 取消时关闭对话框即可
        })
    }
  }
}
</script>














<style lang="scss" scoped>
.enterprise-bidding {
  .breadcrumb {
    margin: 20px 0;
  }

  .content {
    margin: 0 20px 30px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    min-height: 600px;
  }
}

.mobileList {
  display: none;
  margin-top: 20px;

  .mobile_item {
    margin-bottom: 12px;
    padding: 10px;
    border-bottom: 1px solid #ececec;

    h4 {
      margin: 0 0 8px 0;
      cursor: pointer;
      color: #409eff;
    }

    span {
      display: inline-block;
      margin-right: 12px;
    }
  }
}

@media screen and (max-width: 767px) {
  .enterprise-bidding .content {
    margin: 0 10px 20px;
    padding: 14px;
  }

  .mobileList {
    display: block;
  }

  .bidTable,
  .bidPagination {
    display: none;
  }
}
</style>
