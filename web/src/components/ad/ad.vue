<template>
  <div class="advert" id="advert">
    <a href="#nowhere" class="ad"></a>
    <span @click="hiddenAd"></span>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  methods: {
    /*设置透明度*/
    setOpacity(ele, opacity){
      if (ele.style.opacity != undefined) {
        /*兼容FF和GG和新版本IE*/
        ele.style.opacity = opacity / 100;
      } else {
        /*兼容老版本ie*/
        ele.style.filter = "alpha(opacity=" + opacity + ")";
      }
    },
    /*fadeOut函数*/
    fadeOut(ele, opacity, speed) {
      if (ele) {
        let v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 1;
        /*为了便于使用ceil计算，放大100倍*/
        v = v * 100;
        let self = this;
        let timer = setInterval(function() {
            if (v > opacity * 100) {
              v -= Math.ceil(v * 0.1);
              self.setOpacity(ele, v);
            } else {
              clearInterval(timer);
              if(opacity === 0){
                /*节点消失，不然会遮挡元素*/
                ele.style.display = 'none';
              }
            }
        }, speed);
      }
    },
    hiddenAd() {
      let advert = document.getElementById('advert');
      this.fadeOut(advert, 0, 50);
    }
  }
}
</script>

<style scoped lang="scss">
  .advert{
    .ad{
      position: fixed;
      right: 20px;
      bottom: 70px;
      background: url(../../assets/ad/ad1.jpg) no-repeat;
      background-size: cover;
      display: block;
      width: 180px;
      height: 180px;
      transition: transform 1s ease-out;
      z-index: 1000;
      &:hover{
        transform: rotateZ(360deg);
      }
    }
    span{
      position: fixed;
      right: 20px;
      bottom: 250px;
      background: url(../../assets/ad/h.jpg);
      width: 40px;
      height: 18px;
      cursor: pointer;
      z-index: 1000;
    }
  }
</style>
