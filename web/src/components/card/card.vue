<template>
  <div class="card">
    <img v-if="content.author.avatar ? false : true" :src="baseUrl+'default.jpg'" alt="" :class="userBool ? 'avatar self' : 'avatar'" @click="toUserInfo">
    <img v-else :src="baseUrl+content.author.avatar" alt="" :class="userBool ? 'avatar self' : 'avatar'" @click="toUserInfo">
    <div class="author">
      {{content.author.username}}
    </div>
    <div class="title multiLine-ellipse-1" @click="toDetail(content._id)">{{content.title}}</div>
    <div class="desc multiLine-ellipse-2">概要：{{content.description}}</div>
    <div v-if="collectBool" class="collect" @click="collect"><i class="el-icon-plus"><span>收藏</span></i></div>
    <div v-else class="hasCollect" @click="cancelCollect" @mouseover="changeHoverBool" @mouseout="changeHoverBool">
      <div v-if="!hoverCollectBool">
        <i class="el-icon-check"><span>已收藏</span></i>
      </div>
      <div v-else>
        <i class="el-icon-close"><span>取消收藏</span></i>
      </div>
    </div>
    <div class="extra">
      <div>{{content.views}}次阅读</div>
      <div>创建日期：{{content.addTime.slice(0,10)}}</div>
    </div>
  </div>
</template>
<script>
import { getUserInfo, collectContent, cancelCollect } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: 'Card',
  props: ['content'],
  data() {
    return {
      /*基本地址*/
      baseUrl: 'http://10.3.11.200:8081/avatar/',
      collectBool: true,
      hoverCollectBool: false,
      userBool: false
    }
  },
  methods:{
    toDetail(contentId){
      this.$router.push({name: 'contentDetail', params: {
        contentId: contentId,
        content: this.content
      }})
    },
    toUserInfo(){
      if(this.userBool){
          this.$router.push({name: 'userInfo', params: {
            userId: this.content.author._id,
            username: this.content.author.username
          }
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      },
    changeHoverBool(){
      this.hoverCollectBool = !this.hoverCollectBool;
    },
    /*判断是否收藏*/
    checkCollect(){
      /*判断是否登录*/
      if(this.$store.getters.userId){
        getUserInfo({
          userId: this.$store.getters.userId,
          type: ''
        }).then(res => {
          if(res.data.code === 1){
            res.data.userInfo.collectList.forEach((collect, index) => {
              /*收藏列表中存在当前文章*/
              if(collect === this.content._id){
                this.collectBool = false;
              }
            })
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        }).catch(err => {
          util.setMessage(this, '网络故障', 'warning');
        })
      }
    },
    collect(){
      if(this.$store.getters.userId){
        collectContent({
          contentId: this.content._id,
          userId: this.$store.getters.userId
        }).then(res => {
          if(res.data.code === 1){
            this.collectBool = false;
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        })
      }else{
        /*跳转到登录页*/
        this.$router.push({name: 'login'});
      }
    },
    cancelCollect(){
      cancelCollect({
        contentId: this.content._id,
        userId: this.$store.getters.userId
      }).then(res => {
        if(res.data.code === 1){
          this.collectBool = true;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      })
    }
  },
  created(){
    this.checkCollect();
    /*判断作者是否是自己*/
    if(this.content.author._id === this.$store.getters.userId){
      this.userBool = true;
    }
  }
}
</script>
<style scoped lang="scss">
  .card{
    border: 1px solid #eee;
    border-radius: 4px;
    background: #fff;
    margin-top: 80px;
    padding: 10px;
    text-align: center;
    &:hover{
      box-shadow:0 5px 20px rgba(0,0,0,.1);
    }
    .title{
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin: 10px 0;
      &:hover{
        cursor: pointer;
      }
    }
    .desc{
      text-align: center;
      font-size: 16px;
      color: #999;
      height: 40px;
      margin-bottom: 20px;
    }
    .avatar{
      border-radius: 40px;
      width: 80px;
      height: 80px;
      margin-top: -50px;
      display: inline-block;
      border: 1px solid #ddd;
      background-color: #fff;
    }
    .self{
      &:hover{
        cursor: pointer;
      }
    }
    .author{
      font-size: 30px;
      font-weight: bold;
    }
    .collect{
      width: 100px;
      border-radius: 8px;
      height: 26px;
      margin: 0 auto;
      padding: 8px 0;
      border-radius: 40px;
      border-color: #42c02e;
      color: #fff;
      background: #42c02e;
      line-height: 26px;
      &:hover{
        background: #3db922;
        border-color: #3db922;
        cursor: pointer;
      }
      span{
        margin-left: 4px;
      }
    }
    .hasCollect{
      width: 100px;
      border-radius: 8px;
      height: 26px;
      margin: 0 auto;
      padding: 8px 0;
      border-radius: 40px;
      border-color: #999;
      color: #fff;
      background: #999;
      line-height: 26px;
      &:hover{
        background: #ccc;
        border-color: #ccc;
        cursor: pointer;
      }
      span{
        margin-left: 4px;
      }
    }
    .extra{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      height: 30px;
      margin-top: 20px;
      color: #333;
    }
  }
</style>
