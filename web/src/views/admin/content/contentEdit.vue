<template>
    <div class="categoryEdit minWidth">
      <el-row :style="styleObj">
        <el-col :span="14" :offset="4">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="ruleForm.categoryId" placeholder="请选择文章分类">
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
              <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <MceEditor :value="ruleForm.content"/>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { getCategoryAllList, updateContent, contentDetail } from '@/http/http.js';
import util from '@/utils/utils.js';
import MceEditor from '@/components/mceEditor/mceEditor.vue';
export default {
  name: '',
  components: {
    MceEditor
  },
  data() {
    return {
      styleObj: {
        marginTop: '20px',
      },
      categoryList: [],
      ruleForm: {
        title: '',
        categoryId: '',
        description: '',
        content: ''
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
            updateContent({
              id: this.$route.params.contentId,
              title: this.ruleForm.title,
              categoryId: this.ruleForm.categoryId,
              description: this.ruleForm.description,
              content: window.tinyMCE.activeEditor.getContent()
            }).then(res => {
              if(res.data.code === 1){
                util.setMessage(this, res.data.message, 'success');
                this.$router.push({name: 'admin-content'});
              }else{
                util.setMessage(this, res.data.message, 'warning');
              }
            }).catch(err => {
              util.setMessage(this, '网络故障', 'warning');
            })
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
      this.ruleForm = {
        title: '',
        categoryId: '',
        description: ''
      };
      window.tinymce.activeEditor.setContent('');
    }
  },
  created() {
    /*获取分类下拉框*/
    getCategoryAllList().then(res => {
      if(res.data.code === 1){
        this.categoryList = res.data.categoryAllList;
      }else{
        util.setMessage(this, res.data.message, 'warning');
      }
    }).catch(err => {
      util.setMessage(this, '网络故障', 'warning');
    })
    if(this.$route.params.title){
      this.ruleForm.title = this.$route.params.title;
      this.ruleForm.categoryId = this.$route.params.category._id;
      this.ruleForm.description = this.$route.params.description;
      this.ruleForm.content = this.$route.params.content;
    }else{
      contentDetail({
        contentId: this.$route.params.contentId
      }).then(res => {
        if(res.data.code === 1){
          this.ruleForm.title = res.data.content.title;
          this.ruleForm.categoryId = res.data.content.category._id;
          this.ruleForm.description = res.data.content.description;
          this.ruleForm.content = res.data.content.content;
        }else{
          util.setMessage(this, '文章详情获取失败', 'warning');
        }
      }).catch(err => {
        util.setMessage(this, '网络故障', 'warning');
      })
    }
  }
}
</script>
<style scoped></style>
