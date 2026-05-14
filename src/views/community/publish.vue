<template>
  <div class="publish-container">
    <div class="publish-card">
      <h2 class="publish-title">发布帖子</h2>

      <!-- 标题输入 -->
      <div class="form-item">
        <label class="form-label">帖子标题</label>
        <el-input
          v-model="form.title"
          placeholder="请输入帖子标题"
          maxlength="100"
          show-word-limit
          clearable
        />
      </div>

      <!-- 内容编辑器 -->
      <div class="form-item">
        <label class="form-label">帖子内容</label>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="12"
          placeholder="请输入帖子内容，支持多行文本输入"
          maxlength="5000"
          show-word-limit
        />
      </div>

      <!-- 发布按钮 -->
      <div class="form-actions">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" class="publish-btn" @click="handlePublish" :loading="submitting">
          发布
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addPost } from '@/api/community/post'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const submitting = ref(false)
const form = reactive({
  title: '',
  content: ''
})

async function handlePublish() {
  if (!store.getters.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  if (!form.title.trim()) {
    ElMessage.warning('请输入帖子标题')
    return
  }
  if (!form.content.trim()) {
    ElMessage.warning('请输入帖子内容')
    return
  }

  submitting.value = true
  try {
    const res = await addPost({
      title: form.title.trim(),
      content: form.content.trim()
    })
    if (res.code === 200) {
      ElMessage.success('发布成功')
      router.push('/community/list')
    } else {
      ElMessage.error(res.msg || '发布失败')
    }
  } catch (e) {
    ElMessage.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleBack() {
  router.push('/community/list')
}
</script>

<style scoped lang="scss">
.publish-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

.publish-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 36px 48px;
  text-align: left;
}

.publish-title {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #13B69F;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 32px;
}

.publish-btn {
  background-color: #13B69F !important;
  border-color: #13B69F !important;
  border-radius: 20px !important;
  font-size: 15px;
  padding: 10px 32px;
  &:hover {
    background-color: #0fa08d !important;
    border-color: #0fa08d !important;
  }
}
</style>
