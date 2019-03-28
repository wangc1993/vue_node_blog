<template>
  <div class="collect">
    <div class="header">
      <span>每个人自己的博客</span>
      <span class="back" @click="back">首页</span>
    </div>
    <el-container>
      <el-main
      :style="styleObject"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-row :gutter="20">
          <el-col :span="5" :offset="5">
            <div class="category" :style="categoryListStyle">
              <el-select
              v-model="categoryName"
              clearable
              placeholder="全部"
              @change="classNameChange"
              >
                <el-option
                  v-for="item in categoryArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </div>
            <!-- 为了撑开空间 -->
            <div :style="{width: '1px',height:'1px'}"></div>
          </el-col>
          <el-col :span="10">
            <div class="collectList" :style="collectListStyle">
              <div v-if="collectList.length > 0 ? true : false">
                <div class="simpleCollect" v-for="(item, index) in collectList" :key="index">
                  <div class="left">
                    <div class="title multiLine-ellipse-1" @click="toDetail(item._id, item)">
                      <div>{{item.title}}</div>
                    </div>
                    <div class="des multiLine-ellipse-2">
                      简述：{{item.description}}
                    </div>
                    <div class="intro">
                      <div>发布时间:<span class="rightIntro">{{item.addTime}}</span></div>
                      <div><i class="el-icon-view"></i><span class="rightIntro">{{item.views}}</span></div>
                    </div>
                  </div>
                  <div class="right" @click="cancelCollect(item._id)">
                    <i class="el-icon-close"><span>取消收藏</span></i>
                  </div>
                </div>
              </div>
              <div v-else class="center">暂无此类收藏内容</div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <w-footer></w-footer>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import wFooter from '@/components/footer/footer.vue';
import { getCategoryAllList, getUserInfo, cancelCollect } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: 'CollectionDetail',
  components: {
    wFooter
  },
  data() {
    return {
      styleObject: {
        minHeight: `${document.documentElement.clientHeight - 120}px`,
        marginTop: '60px'
      },
      collectListStyle: {
        minHeight: `${document.documentElement.clientHeight - 120}px`
      },
      categoryListStyle: {
        minHeight: `${document.documentElement.clientHeight - 150}px`
      },
      categoryName: '',
      categoryArr:[],
      originCollectList: [],//所有收藏
      collectList: [],//配置后的
      loading: true
    }
  },
  methods:{
    back(){
      this.$router.push('/');
    },
    classNameChange(categoryName){
      this.loading = true;
      this.setCollectList();
    },
    /*配置*/
    setCollectList(){
      if(this.categoryName){
        this.collectList = this.originCollectList.filter(e => e.category === this.categoryName);
        this.loading = false;
      }else{
        this.collectList = this.originCollectList;
        this.loading = false;
      }
    },
    /*前往详情*/
    toDetail(contentId, item) {
      this.$router.push({name: 'contentDetail', params: {
        contentId: contentId,
        content: item
      }})
    },
    getUserInfo(){
      getUserInfo({
        userId: util.getCookie('userId'),
        type: 'true'
      }).then(res => {
        if(res.data.code === 1){
          this.originCollectList = res.data.userInfo.collectList;
          /*配置collectList*/
          this.setCollectList();
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    },
    cancelCollect(contentId){
      cancelCollect({
        contentId: contentId,
        userId: this.$store.getters.userId
      }).then(res => {
        if(res.data.code === 1){
          this.getUserInfo();
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      })
    }
  },
  created(){
    if(this.$store.state.user.userId){
      getCategoryAllList().then(res => {
        if(res.data.code === 1){
          res.data.categoryAllList.forEach((category, index) => {
            let simple = {};
            simple.value = category._id;
            simple.label = category.categoryName;
            this.categoryArr.push(simple);
          });
        }else{
          util.setMessage(this, res.data.message, 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
      /*获取用户信息*/
      this.getUserInfo();
    }else{
      this.$router.back();
    }
  }
}
</script>
<style scoped lang="scss">
  .collect{
    min-width: 1366px;
    .category{
      position: fixed;
      left: 300px;
      border-right: 1px solid #ddd;
      padding-right: 80px;
    }
    .collectList{
      .simpleCollect{
        border-bottom: 1px solid #ddd;
        padding: 10px;
        margin-left: 20px;
        display: flex;
        align-content: center;
        justify-content: space-between;
        font-size: 14px;
        .left{
          width: 70%;
          .title{
            font-weight: bold;
            font-size: 16px;
            &:hover{
              cursor: pointer;
            }
          }
          .des{
            margin: 6px 0;
            color: #666;
          }
          .intro{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #666;
            .rightIntro{
              margin-left: 4px;
            }
          }
        }
        .right{
          text-align: center!important;
          width: 20%;
          height: 40%;
          border-radius: 8px;
          padding: 8px 0;
          border-radius: 40px;
          border-color: #999;
          color: #fff;
          background: #999;
          &:hover{
            background: #ccc;
            border-color: #ccc;
            cursor: pointer;
          }
          span{
            margin-left: 4px;
          }
        }
      }
    }
  }
</style>
