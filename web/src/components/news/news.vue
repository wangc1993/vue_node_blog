<template>
  <div class="news">
    <div class="title">新闻板块</div>
    <el-tabs type="border-card" @tab-click="tabClick" v-model='activeName'>
      <el-tab-pane
      v-for="(item, index) in labelList"
      :key="index"
      :name="item.channelId"
      :label="item.name"
      class="panel"
      v-loading="newsLoading">
      <div
      v-for="(news, index) in item.newList"
      :key="index"
      >
        <el-tooltip class="item" effect="dark" :content="news.title" placement="top" :open-delay='1000'>
          <a :href="news.link" target="_blank" class="newsTitle multiLine-ellipse-1">{{index + 1 + ':' + news.title}}</a>
        </el-tooltip>
      </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getNews } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: 'News',
  data() {
    return {
      labelList: [{
        name: '互联网',
        channelId: '5572a109b3cdc86cf39001e3',
        newList:''
      },{
        name: '社会',
        channelId: '5572a10bb3cdc86cf39001f8',
        newList:''
      },{
        name: '国内',
        channelId: '5572a109b3cdc86cf39001db',
        newList:''
      },{
        name: '国际',
        channelId: '5572a109b3cdc86cf39001de',
        newList:''
      },{
        name: '娱乐',
        channelId: '5572a10ab3cdc86cf39001eb',
        newList:''
      },{
        name: '电商',
        channelId: '9a15d3d4b5cab17f34e6d7976b1b1f30',
        newList:''
      },{
        name: '体育',
        channelId: '5572a109b3cdc86cf39001e6',
        newList:''
      },{
        name: '科技',
        channelId: '5572a10ab3cdc86cf39001f4',
        newList:''
      },{
        name: '财经',
        channelId: '5572a109b3cdc86cf39001e0',
        newList:''
      },{
        name: '健康',
        channelId: '5572a10ab3cdc86cf39001f3',
        newList:''
      }],
      activeName: localStorage.getItem('newsTabIndex') ? localStorage.getItem('newsTabIndex') : '5572a109b3cdc86cf39001e3',
      newsLoading: true
    }
  },
  methods: {
    tabClick(tab){
      localStorage.setItem('newsTabIndex',tab.name);
      this.getNews(tab.name);
    },
    getNews(channelId){
      this.newsLoading = true;
      getNews({
        showapi_appid: '81940',
        showapi_sign: '6d6b19c44e9c4e48ad3452a70549b289',//秘钥
        channelId: channelId
      }).then(res => {
        if(res.data.showapi_res_code === 0){
          for(let i=0; i<this.labelList.length; i++){
            if(this.labelList[i].channelId === channelId){
              this.labelList[i].newList = res.data.showapi_res_body.pagebean.contentlist;
              this.newsLoading = false;
            }
          }
        }else{
          util.setMessage(this, '获取新闻失败！', 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    }
  },
  created(){
    /*首先加载localStorage*/
    this.getNews(this.activeName);
  }
}
</script>
<style scoped lang="scss">
.news{
  background: #fff;
  border-radius: 4px;
  padding-top: 10px;
  .title{
    color: red;
    font-weight:bold;
    padding-left: 10px;
    margin-bottom: 5px;
    margin-left: 10px;
    border-left: 2px solid red;
  }
  .newsTitle{
    color: #999;
    margin-bottom: 2px;
    &:hover{
      color: #409EFF;
    }
  }
  .el-tabs{
    min-height: 525px;
  }
}
</style>
