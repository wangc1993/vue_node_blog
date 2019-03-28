<template>
  <div class="home">
    <el-container>
      <!-- 头部导航 -->
      <el-header>
        <w-header></w-header>
      </el-header>
      <!-- 主体 -->
      <el-main :style="styleObject">
        <el-row :gutter="20">
          <el-col :span="5" >
            <News></News>
            <WeixinContent></WeixinContent>
          </el-col>
          <el-col :span="10">
            <info-list></info-list>
          </el-col>
          <el-col :span="6">
            <Login></Login>
            <More></More>
            <ContentSort></ContentSort>
            <Carousel></Carousel>
          </el-col>
        </el-row>
      </el-main>
      <!-- 页脚 -->
      <el-footer>
        <w-footer></w-footer>
      </el-footer>
    </el-container>
    <Ad></Ad>
  </div>
</template>

<script>
import wHeader from '@/components/header/header.vue';
import wFooter from '@/components/footer/footer.vue';
import infoList from '@/components/infoList/infoList.vue';
import Login from '@/components/login/login.vue';
import More from '@/components/more/more.vue';
import Ad from '@/components/ad/ad.vue';
import News from '@/components/news/news.vue';
import ContentSort from '@/components/contentSort/contentSort.vue';
import Carousel from '@/components/carousel/carousel.vue';
import WeixinContent from '@/components/weixinContent/weixinContent.vue';

export default {
  name: 'Home',
  components: {
    wHeader,
    wFooter,
    infoList,
    Login,
    More,
    Ad,
    News,
    ContentSort,
    Carousel,
    WeixinContent
  },
  data() {
    return {
      styleObject: {
        minHeight: `${document.documentElement.clientHeight - 120}px`,
      }
    }
  },
}
</script>

<style scoped lang="scss">
  .home{
    min-width: 1366px;
    .el-header {
      background-color: #fff;
    }
  }
</style>
