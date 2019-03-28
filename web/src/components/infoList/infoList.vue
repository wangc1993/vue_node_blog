<template>
  <div>
    <div class="infoList" v-loading="listLoading">
      <div class="info" v-show='list.length === 0'>暂无对应文章</div>
      <div class="info" v-for="(item, index) in list" :key="index">
        <div class="title center multiLine-ellipse-1" @click="toDetail(index)">
          <h2>{{item.title}}</h2>
        </div>
        <div class="intro center">
          <span>作者:<span class="rightIntro">{{item.author}}</span></span>
          <span>时间:<span class="rightIntro">{{item.addTime}}</span></span>
          <span>阅读:<span class="rightIntro">{{item.views}}</span></span>
        </div>
        <div class="des multiLine-ellipse-2">
          {{item.description}}
        </div>
        <el-button type="primary" @click="toDetail(index)">阅读全文</el-button>
      </div>
    </div>
    <el-pagination
      v-loading="pageLoading"
      style="float: right;marginTop: 10px"
      @current-change="changeCurrentChange"
      :current-page.sync="currentPage"
      :page-size='pageSize'
      layout="total, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import { getContentAllCount, getContentList, addView } from '@/http/http.js';
import util from '@/utils/utils.js';

export default {
  name: 'InfoList',
  data() {
    return {
      listLoading: true,
      pageLoading: true,
      totalCount: 0,//总数
      pageSize: 8,//每页数量
      currentPage: 1,//当前页
      list: []
    }
  },
  methods: {
    changeCurrentChange(val) {
      this.listLoading = true;
      this.currentPage = val;
      this.getContentList(val, this.pageSize);
    },
    /*前往详情*/
    toDetail(index) {
      this.$router.push({name: 'contentDetail', params: {
        contentId: this.list[index]._id,
        content: this.list[index]
      }})
    },
    getContentAllCount(searchText='') {
      if(!searchText){
        this.currentPage = 1;
      }
      getContentAllCount({
        categoryId: this.$store.state.homeCategoryId
      }).then(res => {
        if(res.data.code === 1){
          this.totalCount = res.data.totalCount;
          /*第一次获取第一页,默认每页5条*/
          this.getContentList(this.currentPage, this.pageSize, searchText);
          this.pageLoading = false;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      });
    },
    /*获取对应页码的文章列表*/
    getContentList(currentPage, pageSize, searchText) {
      getContentList({
        currentPage,
        pageSize,
        categoryId: this.$store.state.homeCategoryId
      }).then(res => {
        if(res.data.code === 1){
          let regexp = new RegExp(`${searchText}`, 'i');
          let filterList = searchText ? res.data.contentList.filter(item => item.title.match(regexp)) : res.data.contentList;
          filterList.forEach(item => {
            item.categoryName = item.category.categoryName;
            item.author = item.author.username;
          })
          this.list = filterList;
          this.listLoading = false;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障1', 'warning');
      })
    },
  },
  created() {
    this.getContentAllCount();
    this.bus.$on('updateContentList', searchText => {
      this.getContentAllCount(searchText);
    })
  }
}
</script>

<style scoped lang="scss">
  .infoList {
    min-height: 880px;
    max-height: 880px;
    overflow-y: scroll;
    //隐藏滚动条
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      width: 0 !important;
    };
    .el-button--primary {
      padding: 6px 10px;
      font-size: 12px;
    }
    .title{
      cursor: pointer;
    }
    .info {
      box-shadow: 0 6px 5px #bbb;
      background-color: #fff;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 10px;
      .intro {
        margin-top: 10px;
        font-size: 12px;
        .rightIntro {
          color: blue;
          padding-right: 4px;
          padding-left: 2px;
        }
      }
      .des {
        margin: 10px 0;
      }
    }
  }
</style>
