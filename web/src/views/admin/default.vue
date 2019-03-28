<template>
    <div>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-card  class="box-card" :style="styleObj">
            <div>
              <span>欢迎来到博客后台管理页面</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script>
export default {
    name: '',
    data() {
        return {
          styleObj: {
            padding: '14px',
            textAlign: 'center',
            marginTop: `${document.documentElement.clientHeight/2 - 100}px`,
          }
        }
    }
}
</script>
<style scoped></style>
