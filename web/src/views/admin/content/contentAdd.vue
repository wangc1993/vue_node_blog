<template>
    <div class="contentAdd minWidth">
      <el-row :style="styleObj">
        <el-col :span="14" :offset="4">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="ruleForm.title" @blur="saveTitle"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="ruleForm.categoryId" placeholder="请选择文章分类" @change="saveCategoryId">
                <el-option
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :label="item.categoryName"
                  :value="item._id"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="description">
              <el-input v-model="ruleForm.description" @blur="saveDesc"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <!-- <el-input type="textarea" v-model="ruleForm.content"></el-input> -->
              <MceEditor :value="initContent"/>
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
import { getCategoryAllList, addContent } from '@/http/http.js';
import util from '@/utils/utils.js';
import moment from 'moment';
import MceEditor from '@/components/mceEditor/mceEditor.vue';
export default {
  components: {
    MceEditor
  },
  data() {
    return {
      initContent: localStorage.getItem('addContentContent') ? localStorage.getItem('addContentContent') : '',
      styleObj: {
        marginTop: '20px',
      },
      categoryList: [],
      ruleForm: {
        title: localStorage.getItem('addContentTitle') ? localStorage.getItem('addContentTitle') : '',
        categoryId: localStorage.getItem('addContentCategoryId') ? localStorage.getItem('addContentCategoryId') : '',
        description: localStorage.getItem('addContentDesc') ? localStorage.getItem('addContentDesc') : ''
      },
      rules: {
        title: [{required: true, message: '请输入文章名', trigger: 'change' }],
        categoryId: [{required: true, message: '请输入分类名', trigger: 'change' }],
        description: [{required: true, message: '请输入简介', trigger: 'change' }],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ruleForm.title.length <= 25){
            addContent({
              title: this.ruleForm.title,
              categoryId: this.ruleForm.categoryId,
              description: this.ruleForm.description,
              /*获取编辑器内容*/
              content: window.tinyMCE.activeEditor.getContent(),
              author: this.$store.getters.userId,
              addTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }).then(res => {
              if(res.data.code === 1){
                util.setMessage(this, res.data.message, 'success');
                this.resetForm(formName);
              }else{
                util.setMessage(this, res.data.message, 'warning');
              }
            }).catch(err => {
              util.setMessage(this, '网络故障', 'warning');
            });
          }else{
            util.setMessage(this, '标题不能超过25个单词！', 'warning');
            return false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      /*清空编辑器内容*/
      window.tinymce.activeEditor.setContent('');
      /*清空草稿*/
      this.delLocalStorage();
    },
    saveTitle(){
      this.setLocalstorage('addContentTitle', this.ruleForm.title);
    },
    saveCategoryId(){
      this.setLocalstorage('addContentCategoryId', this.ruleForm.categoryId);
    },
    saveDesc(){
      this.setLocalstorage('addContentDesc', this.ruleForm.description);
    },
    /*存储草稿*/
    setLocalstorage(key, value){
      localStorage.setItem(key, value);
    },
    /*清除草稿*/
    delLocalStorage(){
      localStorage.removeItem('addContentTitle');
      localStorage.removeItem('addContentCategoryId');
      localStorage.removeItem('addContentDesc');
      localStorage.removeItem('addContentContent');
    }
  },
  created() {
    getCategoryAllList().then(res => {
      if(res.data.code === 1){
        this.categoryList = res.data.categoryAllList;
      }else{
        util.setMessage(this, res.data.message, 'warning');
      }
    }).catch(err => {
      util.setMessage(this, '网络故障', 'warning');
    })
  }
}
</script>
<style scoped></style>
