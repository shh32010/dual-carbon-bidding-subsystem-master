<template>
  <div class="community-container">
    <!-- 帖子列表 -->
    <div class="post-list">
      <div
        v-for="post in postList"
        :key="post.id"
        class="post-card"
      >
        <!-- 上部：标题、作者、发布时间、浏览量、点赞数 -->
        <div class="post-top">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-meta">
            <span class="meta-item">
              <el-icon><User /></el-icon>
              作者：{{ post.authorName }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(post.createTime) }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ post.viewCount }}
            </span>
            <span class="meta-item">
              <el-icon><Star /></el-icon>
              {{ post.likeCount }}
            </span>
          </div>
        </div>
        <!-- 下部：查看详情按钮 -->
        <div class="post-bottom">
          <el-button type="primary" plain @click="goDetail(post.id)">查看详情</el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="postList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无帖子" />
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[5, 10, 20]"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="getList"
      />
    </div>

    <!-- 右侧悬浮发布按钮 -->
    <div class="publish-btn-wrapper">
      <el-button type="primary" class="publish-btn" @click="handlePublish">发布帖子</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listPost } from '@/api/community/post'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const loading = ref(false)
const postList = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})

// 获取帖子列表
async function getList() {
  loading.value = true
  try {
    const res = await listPost(queryParams)
    if (res.code === 200) {
      postList.value = res.rows || []
      total.value = res.total || 0
    }
  } finally {
    loading.value = false
  }
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 查看详情
function goDetail(id) {
  router.push(`/community/detail/${id}`)
}

// 发布帖子（需登录）
function handlePublish() {
  if (!store.getters.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/community/publish')
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.community-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 20px 60px;
  position: relative;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  text-align: left;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}

.post-top {
  margin-bottom: 16px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  .el-icon {
    font-size: 14px;
  }
}

.post-bottom {
  border-top: 1px solid #F0F0F0;
  padding-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  padding: 60px 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

// 右侧悬浮发布按钮
.publish-btn-wrapper {
  position: fixed;
  right: 40px;
  bottom: 80px;
  z-index: 100;
}

.publish-btn {
  background-color: #13B69F !important;
  border-color: #13B69F !important;
  border-radius: 20px !important;
  font-size: 15px;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(19, 182, 159, 0.4);
  &:hover {
    background-color: #0fa08d !important;
    border-color: #0fa08d !important;
  }
}
</style>
