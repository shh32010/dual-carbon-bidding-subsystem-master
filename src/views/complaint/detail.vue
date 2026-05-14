<template>
  <div class="detail">
    <!-- 导航栏 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/complaint/list">违规投诉列表页</a></el-breadcrumb-item>
      <el-breadcrumb-item>投诉详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 详情内容 -->
    <div class="content">
      <div class="title"> {{ bidTitle }}</div>
      <div class="publish">
        <span style="color: #333333">创建时间：</span><span style="color: #666666">{{ bidPublishDatetime }}</span>
      </div>
      <div class="complaintStatus" :style="[{color:(statusVal==='0'?'#E4931B':'#3D3D3D')}]"> {{ getStatusValue(statusVal) }}</div>
      <div class="bidContent" ref="bidContentRef"/>
    </div>
  </div>

</template>

<script setup>
import {getComplaint} from '@/api/bid/complaint'

const { proxy } = getCurrentInstance();

// 获取传递过来的参数
const route= useRoute()
const id = route.query.id
// 详情的字段变量
const bidTitle = ref('')
const bidPublishDatetime = ref('')
const bidContent = ref('')
const bidContentRef = ref(null)
const statusVal = ref('')

onMounted(()=>{
  // 初始化获取详情
  getComplaint(id).then(response => {
    const detailData = response.data
    bidTitle.value = detailData.title;
    bidPublishDatetime.value = proxy.parseTime(detailData.createTime, '{y}年{m}月{d}日');
    bidContent.value = detailData.content;
    statusVal.value = detailData.status;
    bidContentRef.value.innerHTML = bidContent.value
  });
})

// 状态变量
const status = [{
  key: "0",
  value: '正在处理中'
}, {
  key: "1",
  value: '处理完成'
}]
  
// 处理状态变量的函数
const getStatusValue = (key) => {
  const values = status.filter(x => x.key === key);
  if (values.length > 0) {
    return values[0].value
  }
  return ''
}

</script>

<style lang="scss" scoped>
.detail {
  .breadcrumb {
    height: 21px;
    font-family: MicrosoftYaHei, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0em;
    margin-left: 30px
  }
  .complaintStatus {
    text-align: right;
    padding-right: 45px;
  }
  .content {
    margin: 14px 30px 44px 30px;
    background: #FFFFFF;
    border-radius: 10px;
    opacity: 1;
    width: 1380px;
    min-height: 860px;
    display: flex;
    flex-direction: column;

    .title {
      font-family: MicrosoftYaHei, sans-serif;
      height: 35px;
      opacity: 1;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 0em;
      color: #3D3D3D;
      margin-top: 24px;
    }

    .publish {
      font-family: MicrosoftYaHei, sans-serif;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0em;
      color: #333333;
      margin-top: 30px;

      &:nth-child(n + 1) {
        font-family: MicrosoftYaHei, sans-serif;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0em;
        /* 次强调正文标题 */
        color: #333333;
      }

      &:nth-child(n + 2) {
        font-family: MicrosoftYaHei, sans-serif;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0em;
        /* 次强调正文标题 */
        color: #666666;
      }
    }
  }

  .bidContent {
    min-height: 575.34px;
    text-align: left;
    margin: 20px 44px 0 36px;
    :deep(img){
      width: 100% !important;
    }
  }

}

</style>
