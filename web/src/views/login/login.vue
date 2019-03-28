<template>
  <div class="login">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model.number="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import util from '@/utils/utils.js';
  import { login } from '@/http/http.js';
  export default {
    name: 'login',
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          username: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          username: [
            { validator: checkName, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login({
              username: this.ruleForm.username.trim(),
              password: util.md5(this.ruleForm.pass.trim())
            }).then(res => {
              if(res.data.code === 1){
                /*登录成功，返回上一页*/
                this.$router.back(-1);
                /*设置cookie和store*/
                util.setCookie('username', this.ruleForm.username);
                util.setCookie('avatar', res.data.userInfo.avatar);
                util.setCookie('authorization', res.data.authToken);
                this.$store.commit('setUsername', this.ruleForm.username);
                util.setCookie('userId', res.data.userInfo._id);
                this.$store.commit('setUserId', res.data.userInfo._id);
                util.setCookie('isAdmin', res.data.userInfo.isAdmin.toString());
                this.$store.commit('setIsAdmin', res.data.userInfo.isAdmin.toString());
              }else {
                util.setMessage(this, res.data.message, 'warning');
              }
            }).catch(err => {
              util.setMessage(this, '网络故障', 'warning');
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped lang="scss">
  .login{
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
  }
</style>
