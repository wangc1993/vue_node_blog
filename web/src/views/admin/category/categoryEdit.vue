<template>
    <div class="categoryEdit minWidth">
      <el-row :style="styleObj">
        <el-col :span="6" :offset="9">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="分类名"
              prop="categoryName"
              :rules="[
                { required: true, message: '分类名不能为空'}
              ]"
            >
              <el-input v-model="ruleForm.categoryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { updateCategory, categortDetail } from '@/http/http.js';
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
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateCategory({
            id: this.$route.params.categoryId,
            categoryName: this.ruleForm.categoryName
          }).then(res => {
            if(res.data.code === 1){
              util.setMessage(this, res.data.message, 'success');
              this.$router.push({name: 'admin-category'});
            }else{
              util.setMessage(this, res.data.message, 'warning');
            }
          }).catch(err => {
            util.setMessage(this, '网络故障', 'warning');
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.ruleForm.categoryName = '';
    }
  },
  created() {
    if(this.$route.params.categoryName){
      this.ruleForm.categoryName = this.$route.params.categoryName;
    }else{
      categortDetail({
        categoryId: this.$route.params.categoryId
      }).then(res => {
        if(res.data.code === 1){
          this.ruleForm.categoryName = res.data.category.categoryName;        }else{
          util.setMessage(this, '分类详情获取失败', 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    }
  }
}
</script>
<style scoped></style>
