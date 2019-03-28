<template>
  <div class="footer center">
    <div class="records">
      <p>Copyright ©2016 博客作者保留所有权利</p>
      <a href="javascript:;">
        <img src="../../assets/record.png" alt="">苏ICP备000000001号
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'wFooter',
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
  .el-footer {
    padding: 0;
  }
  .footer {
    background: #fff;
    height: 60px;
    /*版权样式*/
    .records {
      p {
        color: #8b8b8b;
        line-height: 25px;
        margin: 0;
      }
      a {
        color: #8b8b8b;
        line-height: 25px;
        text-decoration: none;
      }
      a {
        img {
          vertical-align: middle;
          margin-right: 10px;
          border: none;
        }
      }
    }
  }
</style>
