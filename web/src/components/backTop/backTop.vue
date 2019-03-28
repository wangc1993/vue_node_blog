<template>
  <div class="rightBottom">
    <el-tooltip class="item" effect="dark" content="回到顶部" placement="left">
      <div id="toTop" class="backTotop" @click="toTop"></div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="实时聊天" placement="left">
      <div ref="chat" class="chatting" @click="chat"></div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="文章内容举报" placement="left">
      <div class="tip" @click="tip"></div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop ||  document.body.scrollTop;
      let toTop = document.getElementById('toTop');
      if(scrollTop >= 200){
        if(!toTop.classList.contains('toTop-hidden')){
          toTop.classList.add('toTop-hidden');
        }
      }else{
        if(toTop.classList.contains('toTop-hidden')){
          toTop.classList.remove('toTop-hidden');
        }
      }
    },
    /*回到顶部*/
    toTop() {
      let timer = setInterval(() => {
        if(document.documentElement.scrollTop){
          if(document.documentElement.scrollTop !== 0){
            document.documentElement.scrollTop -= Math.ceil(document.documentElement.scrollTop * 0.1);
          }
        }else if(document.body.scrollTop){
          if(document.body.scrollTop !== 0){
            document.body.scrollTop -= Math.ceil(document.body.scrollTop * 0.1);
          }
        }else{
          /*清除定时器*/
          clearInterval(timer);
        }
      }, 20)
    },
    /*举报*/
    tip() {
      this.$emit('changeTipStatus', true);
    },
    /*聊天*/
    chat() {
      this.$emit('changeChatStatus', true);
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    /*接收chatBus事件*/
    this.chatBus.$on('chattingCall', data => {
      this.$refs.chat.classList.add('chattingCall');
      setTimeout(()=>{
        this.$refs.chat.classList.remove('chattingCall');
      }, 3500)
    })
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped lang="scss">
  @keyframes chattingCall
  {
    0%   {border-color: #dcdcdc;}
    50%  {border-color: red;}
    100% {border-color: #dcdcdc;}
  }
  .rightBottom{
    position: fixed;
    bottom: 65px;
    z-index: 100;
    right: 0;
    div{
      width: 40px;
      height: 40px;
      border: 1px solid #dcdcdc;
      cursor: pointer;
      background-color: #fff;
      background-image: url(../../assets/top.png);
      background-repeat: no-repeat;
      visibility: visible;
      &:hover{
        background-color: #66b1ff;
      }
    }
    .backTotop{
      background-position: 12px -34px;
      visibility: hidden;
      &:hover{
        background-position: -38px -34px;
      }
    }
    .toTop-hidden{
      visibility: visible;
    }
    .chatting{
      background-position: 12px -89px;
      &:hover{
        background-position: -38px -89px;
      }
    }
    .chattingCall{
      animation: chattingCall 3s;
    }
    .tip{
      background-position: 12px 12px;
      &:hover{
        background-position: -38px 12px;
      }
    }
  }
</style>
