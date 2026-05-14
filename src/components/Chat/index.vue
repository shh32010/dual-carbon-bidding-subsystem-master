<template>
  <div class="chat-container">
    <div class="chat-messages" ref="msgContainer">
      <div v-for="(msg, idx) in messages" :key="idx" class="msg" :class="msg.role">
        {{ msg.content }}
      </div>
      <div v-if="aiLoading" class="msg ai loading">
        思考中<span class="dots">...</span>
      </div>
    </div>
    <div class="chat-input">
      <input 
        v-model="inputMsg" 
        type="text" 
        placeholder="请输入您的问题..." 
        :disabled="aiLoading"
        @keydown.enter="send" 
      />
      <button @click="send" :disabled="aiLoading || !inputMsg.trim()">
        {{ aiLoading ? '发送中' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { getAnswer } from '@/api/chat/qa'

const messages = ref([
  { role: 'ai', content: '你好！我是智能助手，有什么可以帮你的吗？' }
])
const inputMsg = ref('')
const aiLoading = ref(false)
const msgContainer = ref(null)

const send = async () => {
  const text = inputMsg.value.trim()
  if (!text || aiLoading.value) return

  messages.value.push({ role: 'user', content: text })
  inputMsg.value = ''
  aiLoading.value = true
  scrollToBottom()

  try {
    const res = await getAnswer(text)
    if (res.data && res.data.length > 0) {
      messages.value.push({ role: 'ai', content: res.data[0].answer || '抱歉，暂未获取到回答。' })
    } else {
      messages.value.push({ role: 'ai', content: '抱歉，您的问题暂时无法回复。' })
    }
  } catch (e) {
    messages.value.push({ role: 'ai', content: 'AI 连接失败，请稍后再试。' })
  } finally {
    aiLoading.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped lang="scss">
/* 保留高度修复，防止空白 */
.chat-container {
  width: 100%;
  height: 420px; /* 核心：强制高度 */
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.msg {
  max-width: 70%;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;

  &.user {
    background: #13B69F; /* 恢复你原来的绿色 */
    color: white;
    margin-left: auto;
  }

  &.ai {
    background: white;
    margin-right: auto;
  }

  &.loading {
    color: #999;
    font-style: italic;
  }
}

.dots {
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.chat-input {
  display: flex;
  padding: 8px;
  background: #fff;
  border-top: 1px solid #eee;
  gap: 10px;

  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #eee;
    border-radius: 4px;
    outline: none;
  }

  button {
    padding: 0 16px;
    background: #13B69F; /* 恢复你原来的绿色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>