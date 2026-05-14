<template>
  <div class="list">
    <!-- 导航栏 -->
    <div style="display: flex; margin-bottom: 30px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>投诉列表页</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="position: absolute;right: 0;">
        <el-button class="goButton" @click="goComplaint">
          去投诉
        </el-button>
      </div>
    </div>
    <!-- 投诉列表 -->
    <div class="content">
      <el-table v-loading="loading" style="width: 100%" :data="complaintList" :header-cell-style="{
      background:'#F6FDFD',height:'46px',color:'#000000',border: '0px solid tan', boxShadow: 'inset 0px -1px 0px 0px #EEEEEE'}"
                :row-style="{height:'50px'}"
                @row-click="handleTableRow"
      >
        <el-table-column label="序号" type="index" width="244"></el-table-column>
        <el-table-column label="投诉名称" align="left" width="530" prop="title"/>
        <el-table-column label="创建时间" align="left" width="300" prop="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="left" prop="status">
          <template #default="scope">
            <span v-if="scope.row.status=== '0'" style="color: #E4931B;">
            {{ getStatusValue(scope.row.status) }}
            </span>
            <template v-else>
              {{ getStatusValue(scope.row.status) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button size="small" style="color: #13B69F;" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 投诉弹窗 -->
    <el-dialog title="投诉" v-model="open" width="800px" append-to-body>
      <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="投诉标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入投诉标题"/>
        </el-form-item>
        <el-form-item label="投诉信息" prop="content">
          <editor v-model="form.content" :min-height="192" :height="400"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactTel">
          <el-input v-model="form.contactTel" placeholder="请输入联系电话"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import Editor from '@/components/Editor'
import {listComplaint, addComplaint} from '@/api/bid/complaint'
import {complaintRules} from '@/views/enterprise/enterpriseInfoData'

const { proxy } = getCurrentInstance();
const rules = complaintRules

// 获取列表数据需要的变量
const loading = ref(true)
const total = ref(0)
const complaintList = ref([])
const queryParams = reactive(
  {
    pageNum: 1,
    pageSize: 20,
  }
)
const complaintStatus = ref([])

onMounted(()=>{
  // 初始化列表数据
  getList();
  // 查询“处理状态”数据字典
  proxy.getDicts('complaint_status').then(x => {
    complaintStatus.value = x.data
  })
})

// 获取投诉列表数据
const getList = () => {
  loading.value = true
  listComplaint(queryParams).then(response => {
    complaintList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 处理状态字段的处理函数
const getStatusValue = (key) => {
  const dict = complaintStatus.value.filter(x => x.dictValue === key)
  if (dict.length > 0) {
    return dict[0].dictLabel
  }
  return ''
}

// 投诉弹窗需要的变量
const store = useStore(); // 使用useStore获取store实例
const userId = computed(() => store.getters.userId); // 使用computed创建对getter的响应式引用
const formRef = ref(null)
const form = ref({})
const open = ref(false)

// 点击去投诉
const goComplaint = () => {
  reset()
  open.value = true
}

// 点击取消
const cancel = () => {
  reset()
  open.value = false
}

// 重置数据
const reset = () => {
  form.value = {
    id: null,
    enterpriseId: null,
    title: null,
    content: '',
    contact: null,
    contactTel: null,
    status: '0',
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    enterpriseName: null
  }
  proxy.resetForm('formRef')
}

// 点击确定按钮
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      form.value.enterpriseId = userId.value
      addComplaint(form.value).then(response => {
        proxy.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

// 跳转页面需要的变量
const router = useRouter();

// 点击列表查看详情
const handleTableRow = (row, column, event) => {
  router.push(`/complaint/detail?id=${row.id}`)
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
    margin: 14px 30px 44px 30px;
    background: #FFFFFF;
    border-radius: 10px;
    opacity: 1;
    min-height: 860px;
    padding: 24px 21px 0 21px;
  }
}

.headerClass {

  background: #F6FDFD;

  box-shadow: inset 0px -1px 0px 0px #EEEEEE;
}

::v-deep .pagination-container .el-pagination {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  position: relative;
}

::v-deep .el-pager li.active {

  cursor: default;
  font-family: MicrosoftYaHei, sans-serif;
  font-size: 12px;
  font-weight: normal;

  letter-spacing: 0em;
  color: #1DD0B7;
}

.goButton {
  width: 120px;
  height: 36px;
  border-radius: 4px;
  opacity: 1;
  background: linear-gradient(90deg, #22CDB5 8%, #46DFCA 96%);
  font-family: MicrosoftYaHei, sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0em;
  color: #FFFFFF;
}
</style>
