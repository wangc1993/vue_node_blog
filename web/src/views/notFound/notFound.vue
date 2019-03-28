<template>
  <div class="notFound" :style="styleObj">
    <div class="head404"></div>
    <div class="txtbg404">
        <div class="txtbox">
          <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
          <p class="paddingbox">请点击以下链接继续浏览网页</p>
          <p>》<a @click="$router.back(-1)">返回上一页面</a></p>
          <p>》<a @click="$router.push({name: 'home'})">返回网站首页</a></p>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    name: '',
    data() {
        return {
          styleObj: {
            /*padding-top多80*/
            height: `${document.documentElement.clientHeight - 80}px`
          }
        }
    }
}
</script>
<style scoped lang="scss">
  .notFound {
    background-color: #494949;
    padding-top: 80px;
    .head404 {
      width:580px;
      height:234px;
      margin: 0 auto;
      background: url('../../assets/head404.png') no-repeat;
    }
    .txtbg404 {
      width:499px;
      height:169px;
      margin:10px auto 0 auto;
      background:url('../../assets/txtbg404.png') no-repeat;
      .txtbox {
        width:390px;
        position:relative;
        top:30px;
        left:60px;
        color:#eee;
        font-size:13px;
        p {
          margin:5px 0;
          line-height:18px;
          a {
            cursor: pointer;
            color:#eee;
            text-decoration:none;
            &:hover {
              color:#FC9D1D;
              text-decoration:underline;
            }
          }
        }
      }
      .paddingbox {
        padding-top:15px;
      }
    }
  }
</style>
