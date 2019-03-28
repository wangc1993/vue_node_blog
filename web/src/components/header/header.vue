<template>
  <div class="header">
    <el-menu v-loading="loading" :default-active="homeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">首页</el-menu-item>
      <el-menu-item v-for="(item, index) in list" :index="item.index" :key="index">
        {{ item.categoryName }}
      </el-menu-item>
      <el-menu-item index="-1" disabled>更多</el-menu-item>
    </el-menu>
    <Collection></Collection>
    <SearchInput></SearchInput>
  </div>
</template>

<script>
import { getCategoryAllList } from '@/http/http.js';
import util from '@/utils/utils.js';
import SearchInput from '@/components/search/search.vue';
import Collection from '@/components/collection/collection.vue';
export default {
  name: 'wHeader',
  data() {
    return {
      loading: true,
      list: []
    }
  },
  components: {
    SearchInput,
    Collection
  },
  computed: {
    homeIndex() {
      return this.$store.state.homeIndex;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      /*修改store中的index和id*/
      this.$store.commit('changeHomeIndex', key);
      if(key !== '0'){
        this.$store.commit('changeHomeCategoryId', this.list[Number(key) - 1]._id);
      }else{
        this.$store.commit('changeHomeCategoryId', '');
      }
      /*触发infoList组件更新*/
      this.bus.$emit('updateContentList', '');
    }
  },
  created() {
    getCategoryAllList().then(res => {
      if(res.data.code === 1){
        res.data.categoryAllList.forEach((category, index) => {
          category.index = (index + 1).toString();
        });
        this.list = res.data.categoryAllList;
        this.loading = false;
      }else{
        util.setMessage(this, res.data.message, 'warning');
      }
    }).catch(err => {
      util.setMessage(this, '网络故障', 'warning');
    })
  }
}
</script>

<style scoped lang="scss">
  .header{
    position: relative;
    .el-menu--horizontal {
      height: 60px;
      padding-right: 300px;
    }
  }
</style>
