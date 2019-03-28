<template>
  <div v-if="weixinList.length > 0 ? false : true"></div>
  <div v-else class="contentSort">
    <div class="title">微信精选</div>
    <div
    v-for="(content, index) in weixinList"
    :key="index"
    class="content multiLine-ellipse-1"
    >
      <el-tooltip class="item" effect="dark" :content="content.title" placement="bottom" :open-delay='1000'>
        <a :href="content.url" target="_blank">{{content.title}}</a>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { getWeixinContent } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: 'WeixinContent',
  data() {
    return {
      weixinList: []
    }
  },
  methods:{
  },
  created(){
    getWeixinContent({
      size: 10
    }).then(res => {
      if(res.data.code === 1){
        this.weixinList = res.data.weixinList;
      }else{
        util.setMessage(this, res.data.message, 'warning');
      }
    }).catch(err => {
      util.setMessage(this, '网络故障', 'warning');
    })
  }
}
</script>
<style scoped lang="scss">
  .contentSort{
    background: #fff;
    margin-top: 10px;
    border-radius: 4px;
    padding: 10px;
    .title{
      color: red;
      font-weight: bold;
      margin-bottom: 10px;
      margin-left: 2px;
      padding-left: 10px;
      border-left: 2px solid red;
    }
    .content{
      a{
        font-size: 14px;
        margin-bottom: 4px;
        cursor: pointer;
        color: #999;
        &:hover{
          color: #409EFF;
        }
      }
    }
  }
</style>
