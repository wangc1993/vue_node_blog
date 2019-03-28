<template>
  <div class="tip">
    <el-dialog
      :visible.sync="dialogVisible"
      width="340px"
      :before-close="handleClose">
      <span slot="title">
        不良信息举报
      </span>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
          <el-form-item label="举报内容 :">
            <div class="multiLine-ellipse-1">{{ruleForm.title}}</div>
          </el-form-item>
          <el-form-item
          prop="reason"
          label="举报原因 :"
          :rules="[{required: true, message: '必须要举报原因', trigger: 'change'}]"
          >
            <el-radio-group v-model="ruleForm.reason">
              <el-radio v-for="(item, index) in reasonList" :key="index" :label="item"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因补充 :">
            <el-input type="textarea" v-model="ruleForm.extra" @keyup.native="extraChange(ruleForm.extra)"></el-input>
          </el-form-item>
          <div class="extra">最多只允许输入<span>{{extraNum}}</span>个字</div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { contentTip } from '@/http/http.js';
import util from '@/utils/utils.js';
export default {
  name: '',
  props: ['contentId', 'title'],
  data() {
    return {
      dialogVisible: true,
      reasonList: ['色情','政治','抄袭','广告','招聘','骂人','其他'],
      extraNum: 30,
      extraNumMax: 30,
      ruleForm: {
        title: this.title,
        reason: '',
        extra: ''
      }
    }
  },
  methods: {
    extraChange(str) {
      if(str.length > this.extraNumMax){
        this.ruleForm.extra = this.ruleForm.extra.slice(0,this.extraNumMax);
      }else{
        this.extraNum = this.extraNumMax - str.length;
      }
    },
    changeUserStatus() {
      this.$emit('changeTipStatus', false);
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          /*判断是否登录*/
          if(this.$store.getters.userId){
            contentTip({
              userId: this.$store.getters.userId,
              contentId: this.contentId,
              reason: this.ruleForm.reason,
              extra: this.ruleForm.extra
            }).then(res => {
              if(res.data.code === 1){
                util.setMessage(this, res.data.message, 'success');
                this.changeUserStatus();
              }else{
                util.setMessage(this, res.data.message, 'warning');
              }
            }).catch(err => {
              util.setMessage(this, '网络故障', 'warning');
            });
          }else{
            util.setMessage(this, '登录后才能举报', 'warning');
          }
        } else {
          return false;
        }
      });
    },
    close() {
      this.changeUserStatus();
    },
    handleClose(done) {
      this.$confirm('确认取消？').then(_ => {
        done();
        this.changeUserStatus();
      }).catch(_ => {});
    }
  }
}
</script>

<style lang="scss">
  .tip{
    .extra{
      font-size: 12px;
      color: #c1c1c1;
      line-height: 18px;
      margin-left: 90px;
      margin-top: -10px;
      span{
        color: red;
      }
    }
    .el-dialog{
      width: 540px!important;
    }
    .el-radio-group{
      padding-top: 4px;
      font-size: 0;
      line-height: 40px;
    }
    .el-radio{
      &:nth-last-child(2){
        margin-left: 0;
      }
    }
    .el-form-item__label{
      color: #999;
      width: 90px!important;
    }
    .el-form-item__content{
      margin-left: 90px!important;
    }
    /* 关闭周围的边框 */
    .el-dialog__headerbtn {
      .el-dialog__close {
            border: dashed 1px #e5e5e5;
      }
      &:hover {
        .el-dialog__close {
              border: dashed 1px #409EFF;
        }
      }
    }
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
      font-size: 16px;
      font-weight: bold;
      .el-icon-close {
        &:before {
          font-size: 16px;
        }
      }
    }
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-dialog__footer {
      padding: 10px 20px;
      border-top: 1px solid #eee;
    }
  }
</style>
