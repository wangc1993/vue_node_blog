<template>
  <div class="carousel">
    <el-carousel trigger="click" height="150px" :autoplay="true">
      <el-carousel-item v-for="(item, index) in urlArr" :key="index">
        <div class="picDiv">
          <img width="100px" height="150px" :src="item.url">
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default {
  name: 'Carousel',
  data() {
    return {
      urlArr: [{
        url: require('../../assets/carousel/kobe1.jpg')
      },
      {
        url: require('../../assets/carousel/kobe2.jpg')
      }]
    }
  }
}
</script>
<style scoped lang="scss">
  .carousel{
    margin-top: 10px;
    .picDiv{
      text-align: center;
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
