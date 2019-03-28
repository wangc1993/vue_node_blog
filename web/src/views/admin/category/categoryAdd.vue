<template>
    <div class="categoryAdd minWidth">
      <el-row :style="styleObj">
        <el-col :span="6" :offset="9">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名" prop="categoryName">
              <el-input v-model="ruleForm.categoryName"></el-input>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { addCategory } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: '',
  data() {
    return {
      styleObj: {
        marginTop: `${document.documentElement.clientHeight/2 -200}px`
      },
      ruleForm: {
        categoryName: ''
      },
      rules: {
        categoryName: {required: true, message: '请输入分类名', trigger: 'change' }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addCategory({
            categoryName: this.ruleForm.categoryName
          }).then(res => {
            if(res.data.code === 1){
              util.setMessage(this, res.data.message, 'success');
              this.$refs[formName].resetFields();
            }else{
              util.setMessage(this, res.data.message, 'warning');
            }
          }).catch(err => {
            util.setMessage(this, '网络故障', 'warning');
          });
        } else {
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
<style scoped></style>
