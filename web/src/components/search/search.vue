<template>
  <div class="searchDiv" :style="{outline: 'none'}">
    <div class="search" :class="searchFocus ? 'getFocus' : ''">
      <img src="../../assets/search.png" alt="">
      <input
      type="text"
      v-model="searchText"
      placeholder="Search"
      :class="searchFocus ? 'getFocus' : ''"
      @focus="getFocus"
      @blur="getBlur"
      @keyup.enter="searchArticle('')">
      <span :class="searchText ? 'hover' : ''" class="delete" @click="deleteText"><i></i></span>
    </div>
    <div v-if="searchListBool && searchList.length > 0" class="searchList">
      <div
      v-for="(item, index) in searchList"
      :key="index"
      :class="searchListBool ? 'getFocus' : ''"
      @click="searchArticle(item)"
      >
        <span>{{item}}</span><span class="del" @click.stop="delSearch(item)">删除</span>
      </div>
      <div class="clear"><span></span><span class="clearAll" @click="clearAll()">清空</span></div>
    </div>
  </div>
</template>
<script>
import util from '@/utils/utils.js';
export default {
  name: 'SearchInput',
  data() {
    return {
      searchText: '',
      searchFocus: false,
      searchListBool: false,
      searchList: []
    }
  },
  methods:{
    /*搜索框获取焦点*/
    getFocus(){
      this.searchFocus = true;
      this.searchListBool = true;
      this.searchList = util.getLocalStorage();
    },
    getBlur(){
      this.searchFocus = false;
      let that = this;
      setTimeout(function(){
        that.searchListBool = false;
      }, 200)
    },
    searchArticle(text){
      if(!text){
        /*触发infoList组件更新*/
        this.bus.$emit('updateContentList', this.searchText);
        /*写入search历史*/
        if(this.searchText){
          util.setLocalStorage(this.searchText);
        }
      }else{
        /*设置search框的值*/
        this.searchText = text;
        /*触发infoList组件更新*/
        this.bus.$emit('updateContentList', text);
        /*写入search历史*/
        util.setLocalStorage(text);
      }
    },
    deleteText(){
      this.searchText = '';
      this.bus.$emit('updateContentList', '');
    },
    delSearch(keyword){
      util.delLocalStorage(keyword);
    },
    clearAll(){
      util.delLocalStorage('all');
    }
  }
}
</script>
<style scoped lang="scss">
  @keyframes changeWid
  {
    0% {width: 167px;}
    100% {width: 200px;}
  }
  @keyframes changeWid2
  {
    0% {width: 225px;}
    100% {width: 260px;}
  }
  @keyframes changeColor
  {
    from {border-color: #eee;}
    to {border-color: #999;}
  }
  .searchDiv{
    position: absolute;
    right: 20px;
    top: 15px;
    width: 250px;
    display: flex;
    z-index: 100;
    justify-content: flex-end;
    .getFocus{
      animation: changeColor 1s forwards ease-in-out;
    }
    .search{
      border: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 30px;
      border-radius: 6px;
      img{
        display: inline-block;
        width: 16px;
        margin: 0 8px 0 12px;
      }
      input{
        padding: 5px;
        border: 0;
        outline:none;
      }
      /* .getFocus{
        animation: changeWid 1s forwards ease-in-out;
      } */
      .delete{
        padding-right: 10px;
        cursor: pointer;
        visibility: hidden;
        i{
          &:before{
            content: '×';
            width: 32px;
            height: 32px;
          }
        }
      }
      .hover{
        visibility: visible;
      }
    }
    .searchList{
      position: absolute;
      background: #f7f7f7;
      top: 34px;
      z-index: 10;
      right: 0;
      border-radius: 4px;
      div{
        width: 218px;
        display: flex;
        justify-content: space-between;
        padding: 5px;
        line-height: 24px;
        &:hover{
          background: #eee;
          border-radius: 4px;
          cursor: pointer;
        }
        .del{
          font-size: 14px;
          color: #999;
          &:hover{
            color: #409EFF;
          }
        }
      }
      /* .getFocus{
        animation: changeWid2 1s forwards ease-in-out;
      } */
      .clear{
        background: #eee;
        width: 100%;
        box-sizing: border-box;
        .clearAll{
          font-size: 14px;
          color: #999;
          &:hover{
            color: #409EFF;
          }
        }
      }
    }
  }
</style>
