<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer style="height: auto; padding: 0;">
      <SiteFooter/>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './components/platform/Header'
import SiteFooter from './components/platform/SiteFooter'

export default {
  name: 'Layout',
  components: {
    Header,
    SiteFooter
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.scss";

.el-container {
  height: 100%;
}

.el-header {
  background-color: #FFFFFF;
  text-align: center;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
}

.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #FAFAFA;
  color: #333;
  text-align: center;
  padding: 0;

}
.el-main::-webkit-scrollbar {
  display: none;
}
</style>
