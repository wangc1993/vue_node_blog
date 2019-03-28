<template>
  <div class="login">
    <div class="title">
      <span v-if="loginStatus === 'register' ? true : false">注册</span>
      <span v-else-if="loginStatus === 'login' ? true : false">登陆</span>
      <span v-else>用户信息</span>
    </div>
    <div v-if="loginStatus === 'success' ? false : true"" class="content">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" @keyup.enter.native="loginStatus === 'register' ? register('ruleForm') : login('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" @keyup.enter.native="loginStatus === 'register' ? register('ruleForm') : login('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass"  v-if="loginStatus === 'register' ? true : false" @keyup.enter.native="register('ruleForm')">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <div class="code">
          <div class="static">
            <span>验证码</span>
            <div class="pic" @click="refreshCode">
              <identify-code :identifyCode="identifyCode"></identify-code>
            </div>
          </div>
          <el-form-item
          label="输入验证码" prop="userCode">
            <el-input type="text" v-model="ruleForm.userCode" auto-complete="off" @keyup.enter.native="loginStatus === 'register' ? register('ruleForm') : login('ruleForm')"></el-input>
          </el-form-item>
        </div>
        <!-- 验证码结束 -->
        <el-form-item v-if="loginStatus === 'register' ? true : false">
          <el-button type="primary" @click="register('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="login('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 用户信息 -->
    <div v-else class="userInfo">
      您好：
      <div class="success" @click="toUserInfo">
        <img v-if="avatar ? false : true" :src="baseUrl+'default.jpg'" alt="" class="avatar">
        <img v-else :src="baseUrl+avatar" alt="" class="avatar">
        <span class="successName">{{successName}}</span>
      </div>
      <span v-if="isAdmin === 'false' ? true : false">，欢迎光临我的博客！</span>
      <span v-else>管理员，<router-link to="/admin">进入管理</router-link></span>
    </div>
    <div class="extra">
      <span v-if="loginStatus === 'register' ? true : false">已有账号？<a @click="changeLoginStatus('login')">马上登陆</a></span>
      <span v-else-if="loginStatus === 'login' ? true : false">没有账号？<a @click="changeLoginStatus('register')">马上注册</a></span>
      <span v-else class="quick"><a @click="changeLoginStatus('logout')">退出</a></span>
    </div>
  </div>
</template>

<script>
  import { login, register } from '@/http/http.js';
  import util from '@/utils/utils.js';
  import IdentifyCode  from '../identify/identifyCode.vue';
  export default {
    name: 'Login',
    components: {IdentifyCode},
    data() {
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号名'));
        } else {
          callback();
        }
      };
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        /*基本地址*/
        baseUrl: 'http://10.3.11.200:8081/avatar/',
        /*基本验证码*/
        identifyCodes: '1234567890abcdefghijklmnopqrstuvwhyz',
        /*初始验证码*/
        identifyCode: '',
        loginStatus: 'login',
        successName: '',
        userId: '',
        avatar: util.getCookie('avatar') ? util.getCookie('avatar') : '',
        isAdmin: 'false',
        ruleForm: {
          userCode: '',
          password: '',
          checkPass: '',
          username: ''
        },
        rules: {
          password: [
            { required: true, validator: validatePassword, trigger: 'change' }
          ],
          checkPass: [
            { required: true, validator: validatePassword2, trigger: 'change' }
          ],
          username: [
            { required: true, validator: validateUsername, trigger: 'change'}
          ],
          userCode: [
            { required: true, message: "验证码不能为空", trigger: 'change'}
          ]
        }
      };
    },
    methods: {
      /*跳转到用户详情*/
      toUserInfo(){
        if(this.successName){
          this.$router.push({name: 'userInfo', params: {
            userId: this.userId ? this.userId : this.$store.getters.userId,
            username: this.username ? this.username : this.$store.getters.username
          }})
        }
      },
      /*生成验证码*/
      makeCode(num) {
        for (let i = 0; i < num; i++) {
          this.identifyCode += this.identifyCodes[util.randomNum(0, this.identifyCodes.length)];
        }
        console.log(this.identifyCode);
      },
      /*刷新验证码*/
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(4);
      },
      /*登录*/
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /*判断验证码*/
            if(this.ruleForm.userCode === this.identifyCode){
              login({
                username: this.ruleForm.username.trim(),
                password: util.md5(this.ruleForm.password.trim())
              }).then(res => {
                if(res.data.code === 1){
                  /*登录成功*/
                  util.setMessage(this, '登录成功', 'success');
                  this.loginStatus = 'success';
                  this.avatar = res.data.userInfo.avatar;
                  this.successName = this.ruleForm.username;
                  this.isAdmin = res.data.userInfo.isAdmin.toString();
                  this.userId = res.data.userInfo._id;
                  /*设置cookie和store*/
                  util.setCookie('username', this.ruleForm.username);
                  util.setCookie('avatar', res.data.userInfo.avatar);
                  util.setCookie('authorization', res.data.authToken);
                  this.$store.commit('setUsername', this.ruleForm.username);
                  util.setCookie('userId', res.data.userInfo._id);
                  this.$store.commit('setUserId', res.data.userInfo._id);
                  util.setCookie('isAdmin', res.data.userInfo.isAdmin.toString());
                  this.$store.commit('setIsAdmin', res.data.userInfo.isAdmin.toString());
                  /*刷新header收藏是否显示*/
                  this.refreshHeaderCollectBus.$emit('refresh');
                  /*刷新收藏*/
                  if(this.$route.name === 'contentDetail'){
                    this.refreshCollectBus.$emit('refresh');
                  }
                  /*重置表单*/
                  this.resetForm('ruleForm');
                }else {
                  util.setMessage(this, res.data.message, 'warning');
                }
              }).catch(err => {
                util.setMessage(this, '网络故障', 'warning');
              })
            }else{
              util.setMessage(this, '验证码错误', 'warning');
              /*刷新验证码*/
              this.refreshCode();
              this.ruleForm.userCode = '';
            }
          } else {
            return false;
          }
        });
      },
      /*注册*/
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.userCode === this.identifyCode){
              register({
                username: this.ruleForm.username.trim(),
                password: util.md5(this.ruleForm.password.trim())
              }).then(res => {
                if(res.data.code === 1){
                  /*注册成功*/
                  util.setMessage(this, res.data.message, 'success');
                  /*清空并跳转到登录页*/
                  this.loginStatus = 'login';
                  this.resetForm('ruleForm');
                }else {
                  util.setMessage(this, res.data.message, 'warning');
                }
              }).catch(err => {
                util.setMessage(this, '网络故障', 'warning');
              })
            }else{
              util.setMessage(this, '验证码错误', 'warning');
              /*刷新验证码*/
              this.refreshCode();
              this.ruleForm.userCode = '';
            }
          } else {
            return false;
          }
        });
      },
      /*重置表单*/
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeLoginStatus(status) {
        /*刷新验证码*/
        this.refreshCode();
        if(status === 'logout'){
          this.loginStatus = 'login';
          /*清除cookie和store*/
          util.delCookie('username');
          this.$store.commit('setUsername', '');
          util.delCookie('userId');
          this.$store.commit('setUserId', '');
          util.delCookie('isAdmin');
          this.$store.commit('setIsAdmin', 'false');
          util.delCookie('authorization');
          /*刷新header收藏是否显示*/
          this.refreshHeaderCollectBus.$emit('refresh');
          /*刷新收藏*/
          if(this.$route.name === 'contentDetail'){
            this.refreshCollectBus.$emit('refresh');
          }
          return;
        }
        this.loginStatus = status;
        /*重置表单*/
        this.resetForm('ruleForm');
      }
    },
    created() {
      /*获取cookie中的username*/
      let username = util.getCookie('username');
      let isAdmin = util.getCookie('isAdmin');
      if(username){
        this.loginStatus = 'success';
        this.successName = username;
        this.isAdmin = isAdmin;
      }
    },
    mounted() {
      this.refreshCode();
      this.bus.$on('refreshLoginStatus', () => {
        this.changeLoginStatus('logout');
      })
    }
  }
</script>

<style scoped lang="scss">
  .login {
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 10px 20px 10px;
    .code{
      .static{
        margin-bottom: 22px;
      }
      span{
        color: #606266;
        margin-left: 40px;
      }
      .pic{
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .userCode{
    }
    .title {
      border-bottom: 2px solid #ddd;
      span {
        border-bottom: 2px solid red;
      }
    }
    .content {
      padding: 30px 20px 0 0;
    }
    .userInfo {
      margin-top: 10px;
      .success{
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 40px;
        width: 40%;
        .successName {
          color: red;
          margin-left: 10px;
        }
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      span {
        a {
          text-decoration: underline;
          color: blue;
          margin-left: 5px;
        }
      }
    }
    .extra {
      font-size: 12px;
      display: flex;
      justify-content: flex-end;
      a {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
      }
      .quick {
        font-size: 16px;
        padding-right: 10px;
      }
    }
  }
</style>
