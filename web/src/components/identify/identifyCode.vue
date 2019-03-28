<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight">
      浏览器不支持canvas元素，请更换
    </canvas>
  </div>
</template>
<script>
  export default{
    name: '',
    props: {
      /*需要展示的验证码*/
      identifyCode: {
        type: String,
        default: '1234'
      },
      /*字体大小，最小值*/
      fontSizeMin: {
        type: Number,
        default: 30
      },
      fontSizeMax: {
        type: Number,
        default: 40
      },
      /*背景颜色色值最小值*/
      backgroundColorMin: {
        type: Number,
        default: 180
      },
      backgroundColorMax: {
        type: Number,
        default: 240
      },
      /*字体颜色最小值*/
      colorMin: {
        type: Number,
        default: 50
      },
      colorMax: {
        type: Number,
        default: 160
      },
      /*干扰线颜色最小值*/
      lineColorMin: {
        type: Number,
        default: 40
      },
      lineColorMax: {
        type: Number,
        default: 180
      },
      /*干扰点颜色最小值*/
      dotColorMin: {
        type: Number,
        default: 0
      },
      dotColorMax: {
        type: Number,
        default: 255
      },
      /*画布宽度*/
      contentWidth: {
        type: Number,
        default: 112
      },
      /*画布高度*/
      contentHeight: {
        type: Number,
        default: 40
      }
    },
    methods: {
      // 生成一个随机数
      randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      // 生成一个随机的颜色
      randomColor (min, max) {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      },
      drawPic () {
        let canvas = document.getElementById('s-canvas')
        let ctx = canvas.getContext('2d')
        ctx.textBaseline = 'bottom'
        // 绘制背景
        ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
        ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
        // 绘制文字
        for (let i = 0; i < this.identifyCode.length; i++) {
          this.drawText(ctx, this.identifyCode[i], i)
        }
        this.drawLine(ctx)
        this.drawDot(ctx)
      },
      drawText (ctx, txt, i) {
        ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
        ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
        let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
        let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
        var deg = this.randomNum(-45, 45)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      },
      drawLine (ctx) {
        // 绘制干扰线
        for (let i = 0; i < 8; i++) {
          ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
          ctx.beginPath()
          ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
          ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
          ctx.stroke()
        }
      },
      drawDot (ctx) {
        // 绘制干扰点
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = this.randomColor(0, 255)
          ctx.beginPath()
          ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    },
    watch: {
      identifyCode () {
        this.drawPic()
      }
    },
    mounted () {
      this.drawPic()
    }
  }
</script>
