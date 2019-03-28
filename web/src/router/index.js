import Vue from 'vue';
import Router from 'vue-router';
import routes from './router.js';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: routes
})

/*全局前置守卫*/
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  /*判断是否是管理员，不是就返回主页*/
  if (to.path.indexOf("/admin") !== -1 && router.app.$options.store.getters.isAdmin !== 'true') {
    next(false);
  } else {
    /*动态设置html中的title*/
    if (to.meta.title) {
      document.title = to.meta.title;
      /*设置索引*/
      if (to.meta.title === '管理员页面') {
        router.app.$options.store.commit('changeAdminIndex', '0')
      }
    }
    next();
  }
})

/*路由错误处理*/
router.onError((callback) => {
  console.log('路由错误：', callback);
});

export default router;
