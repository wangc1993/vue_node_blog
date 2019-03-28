<template>
  <div class="recommendCotent">
    <!-- 头部导航 -->
    <div class="header">
      <span>每个人自己的博客</span>
      <span class="back" @click="back">首页</span>
      <Collection></Collection>
    </div>
    <div :style="{paddingTop: '60px'}"></div>
    <div class="recommendCard">
      <div class="recDiv"><i class="el-icon-document"></i>推荐文章</div>
      <div class="info">推荐指数暂时以阅读量为参考</div>
    </div>
    <div
      class="content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row :gutter="12">
        <el-col :span="8" v-for="(item, index) in sortList" :key="index">
          <Card :content="item"></Card>
        </el-col>
      </el-row>
    </div>
    <div v-if="moreBool" class="more addMore" @click="addMore">加载更多</div>
    <div v-else class="more">没有更多了</div>
    <!-- 页脚 -->
    <w-footer></w-footer>
  </div>
</template>
<script>
import wFooter from '@/components/footer/footer.vue';
import Card from '@/components/card/card.vue';
import Collection from '@/components/collection/collection.vue';
import { getContentSort } from '@/http/http.js';
export default {
  name: 'RecommendCotent',
  components: {
    wFooter,
    Card,
    Collection
  },
  data() {
    return {
      sortList: [],
      currentPage: 1,
      pageSize: 9,
      loading: true,
      moreBool: true
    }
  },
  methods: {
    /*返回首页*/
    back() {
      this.$router.push('/');
    },
    addMore(){
      this.currentPage += 1;
      this.getContentSort();
    },
    getContentSort(){
      this.loading = true;
      getContentSort({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        if(res.data.code === 1){
          this.sortList = this.sortList.concat(res.data.contentSortList);
          if(res.data.contentSortList.length < 6){
            this.moreBool = false;
          }
          this.loading = false;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
  },
  created(){
    this.getContentSort();
  }
}
</script>
<style scoped lang="scss">
  .recommendCotent{
    min-width: 1200px;
    min-height: 1200px;
    .recommendCard{
      width: 1200px;
      margin: 0 auto;
      margin-top: 30px;
      height: 80px;
      background: url('../../assets/recommend.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      font-size: 30px;
      border-radius: 10px;
      color: #666;
      font-weight: bold;
      .recDiv{
        position: absolute;
        top: 0;
        left: 0;
        width: 1170px;
        height: 80px;
        line-height: 80px;
        padding-left: 30px;
        background:rgba(255,255,255,0.3);
        .el-icon-document{
          margin-right: 8px;
        }
      }
      .info{
        position: absolute;
        height: 80px;
        line-height: 80px;
        font-size: 20px;
        color: #666;
        font-weight: 500;
        right: 30px;
      }
    }
    .content{
      width: 80%;
      margin: 0 auto;
      .el-col-8{
        padding-left: 20px!important;
        padding-right: 20px!important;
      }
    }
    .more{
      height: 40px;
      width: 400px;
      background: #a5a5a5;
      margin: 0 auto;
      border-radius: 40px;
      text-align: center;
      line-height: 40px;
      margin-top: 20px;
      margin-bottom: 20px;
      color: #fff;
    }
    .addMore{
      &:hover{
        background: #9b9b9b;
        cursor: pointer;
      }
    }
  }
</style>
