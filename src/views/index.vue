<template>
  <div class="app-container home">
    <div style="width: 100%">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide
        ><img :src="swiperImage1" class="bannerImage"
        /></swiper-slide>
        <swiper-slide
        ><img :src="swiperImage2" class="bannerImage"
        /></swiper-slide>
        <swiper-slide
        ><img :src="swiperImage3" class="bannerImage"
        /></swiper-slide>
      </swiper>
    </div>
    <div style="margin-top: 30px" class="noticeWrapper">
      <div
        style="background-color: #00c99d;padding: 10px;cursor: pointer;position: relative;border-radius: 10px;width: 50%;margin: 5px"
        v-for="item in notice" :key="item.noticeId"
      >
        <div style="display: flex;align-items: center;justify-content: flex-start">
          <strong style="width: 100px">标题：</strong><small style="overflow: hidden;white-space: nowrap;">内容你人呢热闹热闹你人呢人呐人呐人内容你人呢热闹热闹你人呢人呐人呐人内容你人呢热闹热闹你人呢人呐人呐人内容你人呢热闹热闹你人呢人呐人呐人</small>
        </div>
        <!--        <div>-->
        <!--          <strong v-html="item.noticeTitle">-->
        <!--          </strong>-->
        <!--        </div>-->
        <!--        <br>-->
        <!--        <div>-->
        <!--          <div style="cursor: pointer" @click="noticeDetail(item.id)" v-html="item.noticeContent"></div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// Import Swiper styles
import 'swiper/dist/css/swiper.css'
import { listNotice } from '@/api/system/notice'

export default {
  name: 'index',
  components: { swiper, swiperSlide },
  data() {
    return {
      swiperImage1: require('@/assets/images/swiper1.png'),
      swiperImage2: require('@/assets/images/swiper2.png'),
      swiperImage3: require('@/assets/images/swiper3.png'),
      swiperOption: {
        loop: true,
        activeIndex: 2,
        autoplay: {
          delay: 2000, //秒
          stopOnLastSlide: false,
          disableOnInteraction: false //滑动不会失效
        }
      },
      notice: []
    }
  },
  methods: {
    init() {
      listNotice().then(res => {
        this.notice = res.rows
        this.notice.forEach(item => {
          item.noticeTitle = '标题：' + item.noticeTitle
          item.noticeContent = '内容：' + item.noticeContent
        })
      })
    },
    noticeDetail(id) {
      this.$router.push({
        path: '/complaint/detail',
        query: {
          id
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.noticeWrapper {
  display: flex;
  justify-content: space-between;
}

.swiper {
  height: 350px;
  //width: 5000px;
}

.swiper-wrapper {
  width: 1000px;
}

.swiper-slide {
  width: 1000px;
  //margin-left: 30px;
}

.bannerImage {
  width: 100%;
  height: 350px;
  border-radius: 10px;
  opacity: 1;
  border: 0;
}

@media screen and (max-width: 767px) {
  // 调整外部边距
  .app-container {
    padding: 0;
  }
  // 轮播图尺寸
  .swiper {
    width: 100%;
    height: 140px;

    & > > > .swiper-wrapper {
      width: 100%;
    }
  }
  .swiper-slide {
    width: 100%;
  }
  .bannerImage {
    width: 100%;
    height: 140px;
  }

  .notice_Item {
    width: 100%;
  }
}

.headerWrap {
  display: flex;
  justify-content: space-between;
}
</style>
