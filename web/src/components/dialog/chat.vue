<template>
  <div class="chat">
    <el-dialog
      :visible.sync="dialogVisible"
      width="340px"
      :before-close="handleClose">
      <span slot="title">
        在线聊天窗口<span class="online">在线人数：{{onlineCount}}</span>
      </span>
      <div class="chat-box">
        <el-card class="box-card">
          <div v-if="chatList.length === 0 ? true : false">暂无聊天内容</div>
          <div v-for="(item, index) in chatList" :key="index" class="text item">
            <span class="chatName">{{item.username}}</span><span class="chatTime">（{{item.chatTime}}）</span><span>说：</span>
            <div class="chatText" v-html="item.html"></div>
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="style">
          <div class="face">
            <span>表情</span>
            <div class="faceList">
              <img v-for='(value, key, index) in userFaces' :key="index" :src="require(`../../assets/faces/${key}`)" :alt="value" @click="chooseFace(key, value)"/>
            </div>
          </div>
        </div>
        <el-input v-model="chatText" placeholder="请输入聊天内容" @keyup.enter.native="send"></el-input>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOnlineCount } from '@/http/http.js';
import util from '@/utils/utils.js';
import io from 'socket.io-client';
/*全双工通信*/
let socket = io('http://10.3.11.200:8081');
import moment from 'moment';

export default {
  name: '',
  data() {
    return {
      dialogVisible: true,
      chatText: '',//输入框的
      chatList: [],
      userFaces: util.userFaces,
      onlineCount: 0//在线人数
    }
  },
  methods: {
    /*选择表情*/
    chooseFace(key, value) {
      this.chatText += `#${value}#`;
    },
    /*发送聊天内容*/
    send(){
      if(this.$store.getters.username){
        if(this.chatText){
          for(let key in this.userFaces){
            if(this.chatText.indexOf(`#${this.userFaces[key]}#`) !== -1){
              /*要想在replace中传参数，必须借助new RegExp生成*/
              this.chatText = this.chatText.replace(new RegExp(`#${this.userFaces[key]}#`,'g'), `<img style="margin: 0 2px;" src="/static/faces/${key}"/>`);
            }
          }
          /*发送*/
          socket.emit('chatting',{
              'html': this.chatText,
              'username': this.$store.getters.username
          });
          this.chatText = '';
        }else{
          util.setMessage(this, '聊天内容不能为空', 'warning');
        }
      }else{
        util.setMessage(this, '清先登录再聊天', 'warning');
      }
    },
    changeUserStatus() {
      this.$emit('changeChatStatus', false);
    },
    handleClose(done) {
      this.$confirm('你确定不聊了吗？').then(_ => {
        done();
        this.changeUserStatus();
      }).catch(_ => {});
    }
  },
  mounted() {
    /*监听（接收）*/
    socket.on('chatting',data => {
        if(this.$store.getters.username){
          /*聊天推送*/
          this.chatBus.$emit('chattingCall', data);
        }
        let time = moment().format('HH:mm:ss');
        this.chatList.push({
          html: data.html,
          username: data.username,
          chatTime: time
        });
    });
    /*当接收到有人连接进来*/
    socket.on('connected', onlineCount => {
      this.onlineCount = onlineCount;
    });
    /*当接收到有人断开后*/
    socket.on('disconnected', onlineCount => {
      this.onlineCount = onlineCount;
    });
    getOnlineCount().then(res => {
      this.onlineCount = res.data.onlineCount;
    }).catch(err =>{
      util.setMessage(this, '网络故障', 'warning');
    })
  }
}
</script>

<style lang="scss">
  .chat{
    .el-dialog{
      width: 540px!important;
    }
    .el-radio-group{
      padding-top: 4px;
      font-size: 0;
      line-height: 40px;
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
    .online{
      float: right;
      margin-right: 40px;
      font-size: 14px;
      color: #999;
    }
    .chat-box {
      .el-card__body{
        height: 355px;
        overflow-y: scroll;
      }
      span{
        font-size: 14px;
      }
      .chatTime{
        color: #ddd;
      }
      .chatName{
        color: blue;
      }
      .chatText{
        text-indent: 2em;
        font-size: 16px;
        color: #999;
      }
      /* ei */
      .text {
        font-size: 14px;
      }
      .item {
        margin-bottom: 10px;
      }
      .box-card {
        width: 480px;
      }
      /* ei end */
    }
    .style{
      text-align: left;
      margin-bottom: 5px;
      .face{
        margin-left: 10px;
        position: relative;
        cursor: pointer;
        width: 40px;
        &:hover{
          .faceList{
            display: block;
          }
        }
        .faceList{
          position: absolute;
          top: -276px;
          width: 300px;
          background-color: #f0f0f0;
          display: none;
        }
      }
    }
  }
</style>
