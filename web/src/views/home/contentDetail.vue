<template>
  <div class="detail">
    <el-container>
      <!-- 头部导航 -->
      <div class="header">
        <span>每个人自己的博客</span>
        <span class="back" @click="back">首页</span>
        <Collection></Collection>
      </div>
      <!-- 主体 -->
      <el-main :style="styleObject">
        <el-row :gutter="20">
          <el-col :span="12" :offset="3">
            <div class="center">
              <h1 ref="title">{{contentDetail.title}}</h1>
            </div>
            <div class="intro center">
              <!-- 刷新和点击进去的username位置不同 -->
              <span>作者:<span class="rightIntro">{{contentDetail.author.username || contentDetail.author}}</span></span>
              <span>时间:<span class="rightIntro">{{contentDetail.addTime}}</span></span>
              <span>阅读:<span class="rightIntro">{{contentDetail.views}}</span></span>
              <span>评论:<span class="rightIntro">{{totalCount}}</span></span>
            </div>
            <div class="contentDiv">
              <div :class="showAllBool ? 'content' : 'content showLittle'" id="content">
              </div>
              <!-- 阅读更多 -->
              <div :class="showAllBool ? 'readMore hide' : 'readMore'">
                <div class="word" @click="readMore">阅读更多</div>
              </div>
            </div>
            <!-- 赞赏 -->
            <div class="admire">
              <div class="admireText">
                小礼物走一走，欢迎收藏我的文章
              </div>
              <div @click="showAdmire" class="admireButtom">
                赞赏支持
              </div>
              <img v-show="admireBool" src="../../assets/airpay.jpg">
            </div>
            <div class="contentOperate">
              <share :config="{sites:['qzone', 'qq', 'weibo','wechat', 'douban']}"></share>
              <!-- 收藏 -->
              <div v-if="collectBool" class="collect"><span @click="collect">收藏</span></div>
              <div v-else class="collect"><span @click="cancelCollect">取消收藏</span></div>
              <!-- 收藏结束 -->
            </div>
            <div class="comment">
              <el-input type="textarea" v-model="comment"></el-input>
              <div class="right opt">
                <el-button type="primary" @click="onSubmit">发表评论</el-button>
                <el-button @click="onReset">重置</el-button>
              </div>
              <div class="commentList"  v-loading='commentLoading'>
                <div v-if="commentBool">文章暂无评论。</div>
                <div class="simp" v-for="(item, index) in commentList" :key="index">
                  <div class="user" @click="toUserInfo(item.userId.username, item.userId._id)">
                    <img v-if="item.userId.avatar ? false : true" :src="baseUrl+'default.jpg'" alt="" class="avatar">
                    <img v-else :src="baseUrl+item.userId.avatar" alt="" class="avatar">
                    <span class="username">{{item.userId.username}}：</span>
                  </div>
                  <div class="comt">{{item.content}}</div>
                  <div class="info right">
                    <i class="iconfont icon-zan" @click="good(item._id)"></i>推荐<el-badge class="mark" :value="item.good" :max='99'/>
                    <i class="iconfont icon-zan1"  @click="bad(item._id)"></i>吐槽<el-badge class="mark" :value="item.bad" :max='99'/>
                    <span class="time">{{item.addTime}}</span>
                  </div>
                  <!-- 判断用户是否有权删除 -->
                  <div class="delete" v-show="item.userId.username === $store.getters.username ? true : false"><span @click="commentDel(index)">删除</span></div>
                </div>
              </div>
            </div>
            <el-pagination
              v-loading="pageLoading"
              style="float: right; margin-top: 10px"
              @current-change="changeCurrentChange"
              :current-page.sync="currentPage"
              :page-size='pageSize'
              layout="total, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
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
    <BackTop @changeTipStatus="changeTipBool" @changeChatStatus="changeChatBool"></BackTop>
    <!-- 广告 -->
    <Ad></Ad>
    <!-- 举报 -->
    <Tip v-if='tipBool' @changeTipStatus="changeTipStatus" :contentId="$route.params.contentId" :title="contentDetail.title"></Tip>
    <!-- 聊天 -->
    <Chat v-if='chattingBool' @changeChatStatus="changeChatStatus"></Chat>
  </div>
</template>

<script>
import { addComment, getComemntTotal, getComemntList, contentDetail, getGoodTotal, updateGood, getBadTotal, updateBad, commentDel, collectContent, getUserInfo, cancelCollect, addView } from '@/http/http.js';
import wFooter from '@/components/footer/footer.vue';
import Login from '@/components/login/login.vue';
import More from '@/components/more/more.vue';
import BackTop from '@/components/backTop/backTop.vue';
import Ad from '@/components/ad/ad.vue';
import Tip from '@/components/dialog/tip.vue';
import Chat from '@/components/dialog/chat.vue';
import util from '@/utils/utils.js';
import moment from 'moment';
import ContentSort from '@/components/contentSort/contentSort.vue';
import Carousel from '@/components/carousel/carousel.vue';
import Collection from '@/components/collection/collection.vue';

export default {
  name: 'Home',
  components: {
    wFooter,
    Login,
    More,
    BackTop,
    Ad,
    Tip,
    Chat,
    ContentSort,
    Carousel,
    Collection
  },
  data() {
    return {
      showAllBool: false,
      /*基本地址*/
      baseUrl: 'http://10.3.11.200:8081/avatar/',
      tipBool: false,//举报是否显示
      chattingBool: false,//聊天窗体
      commentBool: false,//有无评论
      commentLoading: true,
      admireBool: false,//是否展示admire
      pageLoading: true,
      collectBool: true,//收藏
      styleObject: {
        minHeight: `${document.documentElement.clientHeight - 120}px`,
        marginTop: '60px'
      },
      totalCount: 0,//总数
      pageSize: 3,//每页数量
      currentPage: 1,//当前页
      comment: '',
      commentList: [],
      contentDetail: {
        author: ''
      }
    }
  },
  methods: {
    /*显示赞赏*/
    showAdmire(){
      this.admireBool = !this.admireBool;
    },
    readMore(){
      this.showAllBool = true;
    },
    /*跳转到用户详情*/
    toUserInfo(username, userId){
      if(username === this.$store.getters.username){
        this.$router.push({name: 'userInfo', params: {
          userId,
          username
        }})
      }
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
              if(collect === this.contentDetail._id){
                this.collectBool = false;
              }
            })
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        }).catch(err => {
          util.setMessage(this, '网络故障', 'warning');
        })
      }else{
        this.collectBool = true;
      }
    },
    /*收藏*/
    collect(){
      if(this.$store.getters.username){
        collectContent({
          contentId: this.contentDetail._id,
          userId: this.$store.getters.userId
        }).then(res => {
          if(res.data.code === 1){
            util.setMessage(this, res.data.message, 'success');
            this.collectBool = false;
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        })
      }else{
        util.setMessage(this, '登录后才能收藏', 'warning');
      }
    },
    /*取消收藏*/
    cancelCollect(){
      cancelCollect({
        contentId: this.contentDetail._id,
        userId: this.$store.getters.userId
      }).then(res => {
        if(res.data.code === 1){
          util.setMessage(this, res.data.message, 'success');
          this.collectBool = true;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      })
    },
    /*切换举报(一定是true)*/
    changeTipBool() {
      this.tipBool = true;
    },
    /*切换聊天(一定是true)*/
    changeChatBool() {
      this.chattingBool = true;
    },
    /*切换聊天(一定是false)*/
    changeChatStatus() {
      this.chattingBool = false;
    },
    /*切换举报(一定是false)*/
    changeTipStatus(){
      this.tipBool = false;
    },
    changeCurrentChange(val) {
      this.commentLoading = true;
      this.currentPage = val;
      this.getComemntList(val, this.pageSize);
    },
    /*删除评论*/
    commentDel(index){
      commentDel({
        commentId: this.commentList[index]._id
      }).then(res => {
        if(res.data.code === 1){
          util.setMessage(this, res.data.message, 'success');
          /*重新刷新一下评论*/
          this.getComemntTotal();
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    /*发表*/
    onSubmit() {
      /*判断用户是否登录*/
      if(this.$store.getters.username){
        /*已登录*/
        if(this.comment){
          addComment({
            userId: this.$store.getters.userId,
            addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: this.comment,
            contentId: this.$route.params.contentId
          }).then(res => {
            if(res.data.code === 1){
              util.setMessage(this, res.data.message, 'success');
              this.comment = '';
              /*初始化loading*/
              this.pageLoading = true;
              this.commentLoading = true;
              this.commentBool = false;
              this.getComemntTotal();
            }else{
              util.setMessage(this, res.data.message, 'warning');
            }
          }).catch(err => {
            util.setMessage(this, '网络故障', 'warning');
          })
        }else{
          util.setMessage(this, '评论内容不能为空', 'warning');
        }
      }else{
        util.setMessage(this, '登录后才能评论', 'warning');
      }
    },
    onReset() {
      this.comment = '';
    },
    /*加载评论对应的赞总数*/
    getGoodTotal(commentIdArr) {
      getGoodTotal({
        commentIdArr
      }).then(res => {
        if(res.data.code === 1){
          res.data.goodTotalArr.forEach((total, index) => {
            this.commentList.forEach(comment => {
              if(comment._id === commentIdArr[index]){
                comment.good = total;
              }
            })
          })
          /*触发视图更新*/
          this.commentList = Object.assign([], this.commentList);
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    /*加载评论对应的吐槽总数*/
    getBadTotal(commentIdArr) {
      getBadTotal({
        commentIdArr
      }).then(res => {
        if(res.data.code === 1){
          res.data.badTotalArr.forEach((total, index) => {
            this.commentList.forEach(comment => {
              if(comment._id === commentIdArr[index]){
                comment.bad = total;
              }
            })
          })
          this.commentList = Object.assign([], this.commentList);
          this.commentLoading = false;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    /*加载评论列表*/
    getComemntList(currentPage, pageSize) {
      getComemntList({
        contentId: this.$route.params.contentId,
        currentPage,
        pageSize
      }).then(res => {
        if(res.data.code === 1){
          this.commentList = res.data.commentList;
          let commentIdArr = [];
          res.data.commentList.forEach(commentId => {
            commentIdArr.push(commentId._id);
          })
          /*加载评论对应的赞总数*/
          this.getGoodTotal(commentIdArr);
          /*加载评论对应的吐槽总数*/
          this.getBadTotal(commentIdArr);
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    /*先加载总数，在加载列表*/
    getComemntTotal() {
      /*先将total和commentList归0*/
      this.totalCount = 0;
      this.commentList = [];
      getComemntTotal({
        contentId: this.$route.params.contentId,
      }).then(res => {
        if(res.data.code === 1){
            if(res.data.commentTotal === 0){
              this.commentBool = true;
              this.commentLoading = false;
            }else{
              this.totalCount = res.data.commentTotal;
              this.getComemntList(this.currentPage, this.pageSize);
            }
            this.pageLoading = false;
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    /*返回首页*/
    back() {
      this.$router.push('/');
    },
    /*更新赞*/
    good(commentId) {
      /*判断用户是否登录*/
      if(this.$store.getters.username){
        /*已登录*/
        updateGood({
          username: this.$store.getters.username,
          commentId
        }).then(res => {
          if(res.data.code === 1){
            /*重新加载评论对应的赞总数*/
            this.getGoodTotal([commentId]);
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        }).catch(err => {
          util.setMessage(this, '网络故障', 'warning');
        })
      }else{
        util.setMessage(this, '登录后才能点赞', 'warning');
      }
    },
    /*更新吐槽*/
    bad(commentId) {
      /*判断用户是否登录*/
      if(this.$store.getters.username){
        /*已登录*/
        updateBad({
          username: this.$store.getters.username,
          commentId
        }).then(res => {
          if(res.data.code === 1){
            /*重新加载评论对应的吐槽总数*/
            this.getBadTotal([commentId]);
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        }).catch(err => {
          util.setMessage(this, '网络故障', 'warning');
        })
      }else{
        util.setMessage(this, '登录后才能吐槽', 'warning');
      }
    },
  },
  mounted() {
    this.refreshCollectBus.$on('refresh', () => {
      /*判断用户是否收藏改文章*/
      this.checkCollect();
    })
    /*加载内容*/
    let content = document.getElementById('content');
    this.getComemntTotal();
    /*判断是否刷新*/
    if(this.$route.params.content){
      this.contentDetail = this.$route.params.content;
      content.innerHTML = this.contentDetail.content;
      /*文章是否全部显示*/
      if(content.offsetHeight < 1010){
        this.showAllBool = true;
      }
      /*判断用户是否收藏改文章*/
      this.checkCollect();
    }else{
      contentDetail({
        contentId: this.$route.params.contentId
      }).then(res => {
        if(res.data.code === 1){
          this.contentDetail = res.data.content;
          content.innerHTML = this.contentDetail.content;
          /*文章是否全部显示*/
          if(content.offsetHeight < 1010){
            this.showAllBool = true;
          }
          /*判断用户是否收藏改文章*/
          this.checkCollect();
        }else{
          util.setMessage(this, '文章详情获取失败', 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    }
  },
  created(){
    /*先增加阅读数*/
    addView({
      id: this.$route.params.contentId
    }).then(res => {
      if(res.data.code !== 1){
        util.setMessage(this, res.data.message, 'warning');
      }
    }).catch(err => {
      util.setMessage(this, '网络故障', 'warning');
    })
  }
}
</script>

<style scoped lang="scss">
  .detail{
    min-width: 1366px;
    .intro {
      margin: 10px 0;
      font-size: 14px;
      .rightIntro {
        color: blue;
        padding-right: 4px;
        padding-left: 2px;
      }
    }
    .contentDiv{
      margin: 10px 0;
      overflow-y: hidden;
      position: relative;
      .content {
        text-indent: 2em;
        padding: 5px;
      }
      .showLittle{
        max-height: 1000px;
      }
      .readMore{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: -1px;
        padding-bottom: 20px;
        height: 30px;
        line-height: 30px;
        padding-top: 160px;
        width: 100%;
        background: -webkit-linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1));
        .word{
          color: #ca0c16;
          border: 1px solid #ca0c16;
          width: 70px;
          border-radius: 4px;
          text-align: center;
          &:hover{
            cursor: pointer;
            color: #fff;
            background: #ca0c16;
          }
        }
      }
      .hide{
        display: none;
      }
    }
    /* 赞赏 */
    .admire{
      text-align: center;
      font-size: 17px;
      .admireText{
        color: #969696;
        font-weight: 700;
        margin-bottom: 10px;
      }
      .admireButtom{
        width: 100px;
        padding: 8px 25px;
        font-size: 16px;
        color: #fff;
        background-color: #ea6f5a;
        border-radius: 20px;
        margin: 0 auto;
        margin-bottom: 20px;
        &:hover {
          background-color: #ec6149;
          cursor: pointer;
        }
      }
      img{
        width: 200px;
        height: 300px;
      }
    }
    .contentOperate{
      display: flex;
      align-content: center;
      justify-content: space-between;
      .collect{
        text-align: right;
        margin: 10px 0;
        span{
          cursor: pointer;
          background: #409EFF;
          padding: 4px;
          border-radius: 4px;
          margin-right: 5px;
          color: #fff;
          &:hover{
            background: #66b1ff;
          }
        }
      }
    }
    .comment {
      .commentList {
        /* min-height: 300px; */
      }
      /* 删除 */
      .delete{
        text-align: right;
        span{
          margin-right: 10px;
          cursor: pointer;
          &:hover{
            color: red;
          }
        }
      }
      .opt {
        margin: 10px 0;
      }
      .simp {
        background: #fff;
        padding: 5px;
        margin-top: 15px;
        border-radius: 10px;
        color: #999;
        box-shadow: 0 10px 5px #bbb;
        .user{
          cursor: pointer;
          display: flex;
          align-items: center;
          .avatar{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .username {
            color: #000;
            font-weight: bold;
            display: inline-block;
            margin-left: 10px;
          }
        }
        .comt {
          text-indent: 2em;
          margin-top: 10px;
          color: #333;
        }
        .info {
          .time {
            margin: 0 10px;
          }
          .iconfont {
            margin-right: 4px;
            &:hover {
              color: red;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
