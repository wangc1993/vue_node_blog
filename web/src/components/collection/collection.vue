<template>
  <div class="collection">
    <div v-if="isLogin" @click="toCollect"><i class="el-icon-document"></i><span>收藏</span></div>
  </div>
</template>
<script>
import util from '@/utils/utils.js';
export default {
  name: 'Collection',
  data() {
    return {
      isLogin: util.getCookie('username') ? true : false
    }
  },
  methods:{
    toCollect(){
      this.$router.push({name: 'userCollection'});
    }
  },
  mounted(){
    this.refreshHeaderCollectBus.$on('refresh', () => {
      this.isLogin = !this.isLogin;
    })
  }
}
</script>
<style scoped lang="scss">
  .collection{
    position: absolute;
    right: 300px;
    top: 0;
    height: 60px;
    line-height: 60px;
    color: #999;
    font-size: 20px;
    &:hover{
      cursor: pointer;
      color: #000;
    }
    span{
      margin-left: 4px;
    }
  }
</style>
