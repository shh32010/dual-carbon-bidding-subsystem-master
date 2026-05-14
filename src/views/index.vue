<template>
  <div>
      <el-carousel height="400px">
        <el-carousel-item v-for="image in images" :key="image.id">
          <el-image style="width: 100%" :src="image.url" fit="cover" @error="handleImgError($event, image)" />
        </el-carousel-item>
      </el-carousel>

    <div class="card-container">
      <HomeCard title="新闻资讯" :category="5" :source-data="bidData1"></HomeCard>
      <HomeCard title="信息公告" :category="6" :source-data="bidData2"></HomeCard>
    </div>

    <el-dialog :visible.sync="searchDialogOpenState">
      <el-input v-model="keyword" @change="handleSearch">
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>

      <ul v-if="searchResult.length > 0" style="list-style: none; max-height: 60vh; overflow-y: auto; scrollbar-gutter: stable;">
        <li v-for="bidding in searchResult" @click="jumpTo(bidding.id)" class="item">{{ bidding.bidTitle }}</li>
      </ul>
      <div v-else>无内容请搜索</div>
    </el-dialog>

    <!--    悬浮球-->
   <DragButton></DragButton>
  </div>
</template>

<script>
import HomeCard from '@/components/Platform/HomeCard.vue'
import DragButton  from '@/components/DragButton/index.vue'

import {listBidding} from '@/api/bid/bidding'
import {listBanner} from '@/api/bid/banner'
import { getBaseUrl } from '@/utils/env'

const fallbackImgs = [
  new URL('../assets/images/banner1.png', import.meta.url).href,
  new URL('../assets/images/banner2.png', import.meta.url).href,
  new URL('../assets/images/banner3.png', import.meta.url).href,
]

export default {
  components: {HomeCard , DragButton },
  data() {
    return {
      images: [
        { id: 1, url: fallbackImgs[0] },
        { id: 2, url: fallbackImgs[1] },
        { id: 3, url: fallbackImgs[2] },
      ],
      bidData1: undefined,
      bidData2: undefined,

      searchDialogOpenState: false,
      keyword: "",
      searchResult: [],
    }
  },
  methods: {
    async getData() {
      try {
        const bannerRes = await listBanner()
        if (bannerRes.rows && bannerRes.rows.length > 0) {
          this.images = bannerRes.rows.map(it => {
            it.url = getBaseUrl() + it.url
            return it
          })
        }
      } catch (e) {
        // API 不可用时使用 data 中的本地 banner
      }
      try {
        this.bidData1 = (await listBidding({category: 5})).rows
      } catch (e) { this.bidData1 = [] }
      try {
        this.bidData2 = (await listBidding({category: 6})).rows
      } catch (e) { this.bidData2 = [] }
    },

    async handleSearch() {
      this.searchResult = (await listBidding({bidTitle: this.keyword})).rows
    },

    jumpTo(id) {
      this.$router.push(`/bid/detail?id=${id}`)
    },

    handleImgError(e, image) {
      const idx = this.images.indexOf(image)
      const newUrl = fallbackImgs[idx % fallbackImgs.length]
      this.images.splice(idx, 1, { ...image, url: newUrl })
    },
  },
  mounted() {
    this.getData()

    document.documentElement.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        this.searchDialogOpenState = true
      }
    })
  }
}
</script>

<style scoped>
.swiper {
  height: 33vh;
}

.swiper-wrapper {
  width: 100vw;
}

.swiper-slide {
  width: 1000px;
  margin-left: 30px;
}

.bannerImage {
  width: 100%;
  height: 35vh;
  border-radius: 10px;
  opacity: 1;
  border: 0;
}

.card-container {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 50px;
}

@media screen and (max-width: 540px) {
  .card-container {
    width: 100%;
    padding: 0 16px;
    flex-direction: column;
    align-items: center;
  }
}

.item:hover {
  color: #1AD0B6;
}
</style>


