<template>
  <div class="detail-container">
    <!-- 帖子主体 -->
    <div class="post-body">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span class="meta-item">
          <el-icon><User /></el-icon>
          {{ post.authorName }}
        </span>
        <span class="meta-item">
          <el-icon><Clock /></el-icon>
          {{ formatDate(post.createTime) }}
        </span>
      </div>

      <div class="post-content">{{ post.content }}</div>

      <!-- 点赞和收藏 -->
      <div class="post-actions">
        <el-button
          :type="liked ? 'danger' : 'info'"
          plain
          round
          @click="handleLike"
          class="action-btn"
        >
          <el-icon><Star /></el-icon>
          点赞 {{ post.likeCount }}
        </el-button>
        <el-button
          :type="collected ? 'warning' : 'info'"
          plain
          round
          @click="handleCollect"
          class="action-btn"
        >
          <el-icon><StarFilled /></el-icon>
          收藏
        </el-button>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comment-section">
      <h3 class="comment-title">评论区</h3>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comment">
          <el-empty description="暂无评论，快来抢沙发！" :image-size="80" />
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-card"
        >
          <div class="comment-top">
            <span class="commenter">
              <el-icon><User /></el-icon>
              {{ comment.commenterName }}
            </span>
            <span class="comment-time">{{ formatDate(comment.createTime) }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>

      <!-- 评论输入框 -->
      <div class="comment-input-area">
        <el-input
          v-model="commentContent"
          type="textarea"
          :rows="3"
          placeholder="请输入评论内容..."
          maxlength="500"
          show-word-limit
        />
        <el-button
          type="primary"
          class="submit-comment-btn"
          @click="handleSubmitComment"
          :disabled="!commentContent.trim()"
        >
          发表评论
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPost, toggleLike, toggleCollect, addComment, listComment } from '@/api/community/post'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const postId = route.params.id
const post = ref({})
const comments = ref([])
const commentContent = ref('')
const liked = ref(false)
const collected = ref(false)

async function loadPost() {
  try {
    const res = await getPost(postId)
    if (res.code === 200) {
      post.value = res.data?.post || {}
      comments.value = res.data?.comments || []
    } else {
      ElMessage.error(res.msg || '加载失败')
      router.push('/community/list')
    }
  } catch (e) {
    ElMessage.error('加载失败')
    router.push('/community/list')
  }
}

// 点赞
async function handleLike() {
  if (!store.getters.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  try {
    const res = await toggleLike(postId)
    if (res.code === 200) {
      liked.value = !liked.value
      post.value.likeCount = res.data || post.value.likeCount
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

// 收藏
async function handleCollect() {
  if (!store.getters.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  try {
    const res = await toggleCollect(postId)
    if (res.code === 200) {
      collected.value = !collected.value
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

// 发表评论
async function handleSubmitComment() {
  if (!store.getters.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  if (!commentContent.value.trim()) return
  try {
    const res = await addComment({ postId: Number(postId), content: commentContent.value.trim() })
    if (res.code === 200) {
      ElMessage.success('评论成功')
      commentContent.value = ''
      // 刷新评论列表
      const res2 = await listComment(postId)
      if (res2.code === 200) {
        comments.value = res2.data || []
      }
    } else {
      ElMessage.error(res.msg)
    }
  } catch (e) {
    ElMessage.error('评论失败')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped lang="scss">
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

.post-body {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 40px;
  margin-bottom: 24px;
  text-align: left;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F0F0F0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.post-content {
  font-size: 15px;
  color: #303133;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 28px;
}

.post-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

.action-btn {
  border-radius: 20px !important;
  .el-icon {
    margin-right: 4px;
  }
}

// 评论区
.comment-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 28px 40px;
  text-align: left;
}

.comment-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #13B69F;
  display: inline-block;
}

.comment-list {
  margin-bottom: 24px;
}

.no-comment {
  padding: 20px 0;
}

.comment-card {
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 14px;
  background-color: #FAFAFA;
}

.comment-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.commenter {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.comment-time {
  font-size: 12px;
  color: #C0C4CC;
}

.comment-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
  white-space: pre-wrap;
}

.comment-input-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-comment-btn {
  background-color: #13B69F !important;
  border-color: #13B69F !important;
  align-self: flex-end;
  border-radius: 20px;
  &:hover {
    background-color: #0fa08d !important;
    border-color: #0fa08d !important;
  }
  &:disabled {
    background-color: #A0CFFF !important;
    border-color: #A0CFFF !important;
  }
}
</style>
