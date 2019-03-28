import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import getters from './getters.js'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: user
  },
  state: {
    homeIndex: window.sessionStorage.getItem('homeIndex') ? window.sessionStorage.getItem('homeIndex') : '0',
    adminIndex: window.sessionStorage.getItem('adminIndex') ? window.sessionStorage.getItem('adminIndex') : '0',
    /*当前分类的id*/
    homeCategoryId: window.sessionStorage.getItem('homeCategoryId') ? window.sessionStorage.getItem('homeCategoryId') : '',
  },
  mutations: {
    changeHomeIndex(state, index) {
      state.homeIndex = index;
      /*设置session*/
      window.sessionStorage.setItem('homeIndex', index);
    },
    changeAdminIndex(state, index) {
      state.adminIndex = index;
      /*设置session*/
      window.sessionStorage.setItem('adminIndex', index);
    },
    changeHomeCategoryId(state, id) {
      state.homeCategoryId = id;
      /*设置session*/
      window.sessionStorage.setItem('homeCategoryId', id);
    },
  },
  getters
})

export default store
