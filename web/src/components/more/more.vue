<template>
  <div class="more">
    <div class="title">
      <span>社区</span>
    </div>
    <ul>
      <li><a href="https://github.com/wangc1993" target="_blank">github(carrey)</a></li>
      <li><a href="https://www.cnblogs.com/wang98/" target="_blank">博客园(carrey)</a></li>
      <li><a href="https://wangc1993.github.io/" target="_blank">carreyWang的博客空间</a></li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'More',
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
  .more {
    padding: 10px;
    background-color: #fff;
    margin-top: 10px;
    border-radius: 4px;
    a {
      cursor: pointer;
      color: red;
    }
    .title {
      border-bottom: 2px solid #ddd;
      margin-bottom: 10px;
      span {
        border-bottom: 2px solid red;
      }
    }
  }
</style>
