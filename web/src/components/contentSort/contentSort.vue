<template>
  <div v-if="sortList.length > 0 ? false : true"></div>
  <div v-else class="contentSort">
    <div class="title">阅读排行</div>
    <div
    v-for="(content, index) in sortList"
    :key="index"
    class="content"
    @click="toDetail(content._id)"
    >
      <el-tooltip class="item" effect="dark" :content="content.title" placement="bottom" :open-delay='1000'>
        <div :class="content.title.length > 25 ? 'scroll' : ''">{{content.title}}</div>
      </el-tooltip>
    </div>
    <div class="more" @click="toRecommendCotent">查看更多<i class="el-icon-arrow-right"></i></div>
    <div class="refresh">
      <i :class="this.clickBool ? 'click el-icon-refresh' : 'el-icon-refresh'"></i>
      <span @click="refresh">换一批</span>
    </div>
  </div>
</template>
<script>
import { getContentSort } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: 'ContentSort',
  data() {
    return {
      sortList: [],
      currentPage: 1,
      pageSize: 6,
      clickBool: false
    }
  },
  methods:{
    toDetail(contentId){
      this.$router.push({name: 'contentDetail', params: {contentId: contentId}});
    },
    refresh(){
      this.clickBool = true;
      if(this.sortList.length === 6){
        this.currentPage += 1;
        this.getContentSort();
        let that = this;
        setTimeout(function(){
          that.clickBool = false;
        }, 500)
      }else{
        this.$notify({
          title: '没有更多推荐了！',
          type: 'warning',
          duration: 1000
        });
      }
    },
    getContentSort(){
      getContentSort({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        if(res.data.code === 1){
          if(res.data.contentSortList.length === 0){
            this.$notify({
              title: '没有更多推荐了！',
              type: 'warning',
              duration: 1000
            });
          }else{
            this.sortList = res.data.contentSortList;
          }
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    toRecommendCotent(){
      this.$router.push({name: 'recommendCotent'});
    }
  },
  created(){
    this.getContentSort();
  }
}
</script>
<style scoped lang="scss">
  @keyframes wordsLoop {
    0% {
        transform: translateX(0px);
        -webkit-transform: translateX(0px);
    }
    100% {
        transform: translateX(-40%);
        -webkit-transform: translateX(-40%);
    }
  }

  @-webkit-keyframes wordsLoop {
    0% {
        transform: translateX(0px);
        -webkit-transform: translateX(0px);
    }
    100% {
        transform: translateX(-40%);
        -webkit-transform: translateX(-40%);
    }
  }
  .contentSort{
    background: #fff;
    margin-top: 10px;
    border-radius: 4px;
    padding: 10px;
    position: relative;
    .more{
      background-color: #f7f7f7;
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      text-align: center;
      padding: 7px;
      color: #787878;
      &:hover{
        cursor: pointer;
        color: #333;
      }
    }
    .title{
      color: red;
      font-weight: bold;
      margin-bottom: 10px;
      margin-left: 2px;
      padding-left: 10px;
      border-left: 2px solid red;
    }
    .content{
      font-size: 14px;
      margin-bottom: 4px;
      cursor: pointer;
      overflow-x: hidden;
      &:hover{
        color: #409EFF;
      }
    }
    .scroll {
      width: 300px;
      white-space: nowrap;
      animation: 6s wordsLoop linear infinite normal;
      &:hover{
        animation: none;
      }
    }
    .refresh{
      position: absolute;
      right: 20px;
      top: 5px;
      color: #999;
      span{
        margin-left: 2px;
        &:hover{
          cursor: pointer;
          color: #333;
        }
      }
      .click{
        transition: transform 1s ease-out;
        transform: rotateZ(-720deg);
      }
    }
  }
</style>
