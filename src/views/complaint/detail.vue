<template>
  <div class="container">
    <strong v-html="content.noticeTitle">
    </strong>
    <div style="cursor: pointer" v-html="content.noticeContent"></div>
  </div>
</template>

<script>

import { getNotice } from '@/api/system/notice'

export default {
  data() {
    return {
      content: {}
    }
  },
  methods: {
    init() {
      console.log(this.$route.query.id)
      getNotice(this.$route.query.id).then(res => {
        this.content = res.data
        console.log(this.content)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
