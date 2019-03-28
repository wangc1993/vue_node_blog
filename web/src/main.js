// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/';
import ElementUI from 'element-ui';
/*引入富文本编辑文件*/
import '../static/tinymce/tinymce.min.js';
window.tinymce.baseURL = '../static/tinymce';
/*引入静态资源*/
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css';
import './assets/iconfont.css';

Vue.config.productionTip = false

/*引入分享插件*/
import Share from 'vue-social-share'
import 'vue-social-share/dist/client.css';
Vue.use(Share);

Vue.use(ElementUI);

/*组件通信（点击首页nav触发）*/
let bus = new Vue()
Vue.prototype.bus = bus

/*聊天推送*/
let chatBus = new Vue()
Vue.prototype.chatBus = chatBus

/*登录完成刷新收藏按钮*/
let refreshCollectBus = new Vue()
Vue.prototype.refreshCollectBus = refreshCollectBus

/*完成用户信息修改刷新登录状态*/
let refreshLoginStatus = new Vue()
Vue.prototype.refreshLoginStatus = refreshLoginStatus

/*登录完成刷新header收藏按钮*/
let refreshHeaderCollectBus = new Vue()
Vue.prototype.refreshHeaderCollectBus = refreshHeaderCollectBus

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
