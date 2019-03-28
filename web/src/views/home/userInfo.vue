<template>
  <div class="userInfo">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="返回" name="index">
    </el-tab-pane>
      <el-tab-pane label="头像上传" name="avatar">
        <el-upload
          class="upload"
          drag
          action="noneed"
          :multiple="false"
          :before-upload="beforeUpload"
          accept=".jpg,.png"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="账户设置" name="setting">
        <div class="account">
          <div class="username">
            <div class="top">
              <div class="top-left">登录用户名</div>
              <div class="top-right" @click="modifyName">修改</div>
            </div>
            <div class="bottom">
              <div v-show="modifyNameBool" class="bottom-left">您的登录用户名</div>
              <div v-show="!modifyNameBool" class="bottom-left">
                <el-form :model="formData">
                  <el-form-item
                  label="新登录用户名"
                  prop="newUsername"
                  :rules="{
                    required: true, message: '域名不能为空', trigger: 'change'
                  }"
                  >
                    <el-input v-model="formData.newUsername"></el-input>
                  </el-form-item>
                </el-form>
                <el-button size="mini" round @click="update('username')">保存</el-button>
                <el-button size="mini" round>取消</el-button>
              </div>
              <div class="bottom-right">{{userInfo.username}}</div>
            </div>
          </div>
          <div class="password">
            <div class="top">
              <div class="top-left">密码</div>
              <div class="top-right" @click="modifyPassword">修改</div>
            </div>
            <div class="bottom">
              <div v-show="modifyPasswordBool" class="bottom-left">您的密码</div>
              <div v-show="!modifyPasswordBool" class="bottom-left">
                <el-form>
                  <el-form-item
                  label="旧密码"
                  :rules="{
                    required: true, message: '域名不能为空', trigger: 'change'
                  }"
                  >
                    <el-input v-model="formData.oldPassword"></el-input>
                  </el-form-item>
                  <el-form-item
                  label="新密码"
                  :rules="{
                    required: true, message: '域名不能为空', trigger: 'change'
                  }"
                  >
                    <el-input v-model="formData.newPassword1"></el-input>
                  </el-form-item>
                  <el-form-item
                  label="确认密码"
                  :rules="{
                    required: true, message: '域名不能为空', trigger: 'change'
                  }"
                  >
                    <el-input v-model="formData.newPassword2"></el-input>
                  </el-form-item>
                </el-form>
                <el-button size="mini" round @click="update('password')">保存</el-button>
                <el-button size="mini" round>取消</el-button>
              </div>
              <div class="bottom-right">*******</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getUserInfo, updateUserInfo, fileUpload } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: '',
  data() {
    return {
      activeName: 'setting',
      modifyNameBool: true,
      modifyPasswordBool: true,
      formData:{
        newUsername: '',
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      userInfo: {}
    }
  },
  methods: {
    /*上传图片*/
    beforeUpload(file){
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png') {
        if(file.size <= 51200){
          let formFile = new FormData()
          formFile.append('file', file);
          formFile.append('userId', this.$route.params.userId);
          fileUpload(formFile).then(res => {
            if (res.data.code === 1) {
              util.setMessage(this, res.data.message, 'success');
              this.bus.$emit('refreshLoginStatus');
              util.delCookie('avatar');
            } else {
              util.setMessage(this, res.data.message, 'warning');
            }
          }).catch(error => {
            util.setMessage(this, '网络故障', 'warning');
          })
        }else{
          util.setMessage(this, '上传文件不能大于50kb!', 'warning');
        }
      } else {
        util.setMessage(this, '上传文件只能是 jpg、png格式!', 'warning');
      }
      return false
    },
    update(type){
      let postInfo = '';
      if(type === 'username' && this.formData.newUsername !== ''){
        if(this.formData.newUsername !== this.userInfo.username){
          postInfo = {
            username: this.formData.newUsername,
            userId: this.$route.params.userId,
          };
        }else{
          util.setMessage(this, '前后用户名不能一样', 'warning');
        }
      }else{
        /*修改密码*/
        if(this.formData.oldPassword !== '' && this.formData.newPassword1 !== '' && this.formData.newPassword2 !== ''){
          if(this.formData.newPassword1 === this.formData.newPassword2){
            let password = util.md5(this.formData.newPassword2)
            postInfo = {
              password,
              userId: this.$route.params.userId,
            };
          }else{
            util.setMessage(this, '确认密码不一致', 'warning');
          }
        }
      }
      if(postInfo){
        updateUserInfo(postInfo).then(res => {
          if(res.data.code === 1){
            util.setMessage(this, res.data.message, 'success');
            this.bus.$emit('refreshLoginStatus');
            this.userInfo.username = this.formData.newUsername;
          }else{
            util.setMessage(this, res.data.message, 'warning');
          }
        }).catch(error => {
          util.setMessage(this, '网络故障', 'warning');
        })
      }
    },
    /*返回上一页*/
    handleClick(tab, event) {
      if(tab.index === '0'){
        this.$router.back(-1);
      }
    },
    modifyName(){
      this.modifyNameBool = !this.modifyNameBool;
    },
    modifyPassword(){
      this.modifyPasswordBool = !this.modifyPasswordBool;
    },
    toCotentDetail(contentId){
      console.log(contentId);
      this.$router.push({
        name: 'contentDetail',
        params: {
          contentId
        }
      })
    }
  },
  created(){
    getUserInfo({
      userId: this.$route.params.userId,
      type: ''
    }).then(res => {
      if(res.data.code === 1){
        this.userInfo = res.data.userInfo;
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
  .userInfo{
    .el-tabs{
      background-color: #fff;
      padding: 10px;
      width: 500px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      .el-tab-pane{
        height: 420px;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload{
          text-align: center;
        }
        .account{
          width: 80%;
          >div{
            margin-bottom: 20px;
          }
          .top{
            display: flex;
            justify-content: space-between;
            padding-bottom: 4px;
            border-bottom: 1px solid #999;
            .top-right{
              color: #999;
              text-decoration: underline;
              cursor: pointer;
              &:hover{
                color: red;
              }
            }
          }
          .bottom{
            display: flex;
            justify-content: space-between;
            padding-top: 4px;
            .bottom-left{
              color: #999;
              width: 300px;
              .el-input{
                width: 60%;
              }
            }
            .bottom-right{
              color: #333;
            }
          }
        }
      }
    }
  }
</style>
