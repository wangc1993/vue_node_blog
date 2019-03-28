<template>
    <div class="admin">
      <!-- 导航 -->
      <el-menu
        :default-active="adminIndex"
        class="el-menu-demo"
        mode="horizontal"
        router
        @select="handleSelect">
        <el-menu-item index="0" class="one" disabled>后台管理</el-menu-item>
        <el-menu-item index="/" >
          用户首页
        </el-menu-item>
        <el-menu-item index="/admin/user" >
          用户管理
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">分类管理</template>
          <el-menu-item v-for="(item, index) in categorylist" :key="index" :index="item.index">
            {{ item.value }}
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">文章管理</template>
          <el-menu-item v-for="(item, index) in contentList" :key="index" :index="item.index">
            {{ item.value }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/admin/tip" >
          举报管理
        </el-menu-item>
      </el-menu>
      <!-- 主体 -->
      <div class="main">
        <router-view/>
      </div>
    </div>
</template>
<script>
import wFooter from '@/components/footer/footer.vue';
export default {
    name: '',
    components: {wFooter},
    data() {
      return {
        categorylist: [
          {index: '/admin/category', value: '分类首页'},
          {index: '/admin/category/add', value: '分类添加'},
        ],
        contentList: [
          {index: '/admin/content', value: '文章首页'},
          {index: '/admin/content/add', value: '文章添加'},
        ]
      }
    },
    computed: {
      adminIndex() {
        return this.$store.state.adminIndex;
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        /*判断是否返回首页*/
        if(key !== '/'){
          /*修改store中的index*/
          this.$store.commit('changeAdminIndex', key);
        }
      }
    }
}
</script>
<style scoped lang="scss">
  .admin {
    .el-menu-demo {
      position: fixed;
      top: 0;
      z-index: 100;
      width: 100%;
      min-width: 1366px;
    }
    /* 第一个li样式 */
    .one {
      border-bottom: none !important;
      font-size: 18px;
      font-weight: bold;
      color: #000;
      opacity: 1;
    }
    .main {
      margin-top: 80px;
      min-width: 1366px;
    }
  }
</style>
