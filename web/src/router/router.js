import Admin from '@/views/admin/index.vue';

const homeRouter = {
  path: '/',
  name: 'home',
  meta: {
    title: '博客-首页'
  },
  component: resolve => {
    require(['@/views/home/home.vue'], resolve)
  }
};

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '博客-登录'
  },
  component: resolve => {
    require(['@/views/login/login.vue'], resolve)
  }
};

const collectRouter = {
  path: '/collection',
  name: 'userCollection',
  meta: {
    title: '博客-收藏'
  },
  component: resolve => {
    require(['@/views/home/collection.vue'], resolve)
  }
};

const contentDetailRouter = {
  path: '/contentDetail/:contentId',
  name: 'contentDetail',
  meta: {
    title: '文章-详情'
  },
  component: resolve => {
    require(['@/views/home/contentDetail.vue'], resolve)
  }
};

const recommendCotentRouter = {
  path: '/recommendCotent',
  name: 'recommendCotent',
  meta: {
    title: '文章-推荐'
  },
  component: resolve => {
    require(['@/views/home/recommendCotent.vue'], resolve)
  }
};

const userInfoRouter = {
  path: '/userInfo/:userId',
  name: 'userInfo',
  meta: {
    title: '用户-信息'
  },
  component: resolve => {
    require(['@/views/home/userInfo.vue'], resolve)
  }
};

const adminRouter = {
  path: '/admin',
  component: Admin,
  children: [{
    path: '/',
    name: 'admin',
    component: resolve => require(['@/views/admin/default.vue'], resolve),
    meta: {
      title: '管理员页面',
    }
  }, {
    path: 'user',
    name: 'admin-user',
    meta: {
      title: '用户管理',
    },
    component: resolve => require(['@/views/admin/user.vue'], resolve)
  }, {
    path: 'tip',
    name: 'admin-tip',
    meta: {
      title: '举报管理',
    },
    component: resolve => require(['@/views/admin/tip/tip.vue'], resolve)
  }, {
    path: 'category',
    name: 'admin-category',
    meta: {
      title: '分类首页',
    },
    component: resolve => require(['@/views/admin/category/category.vue'], resolve)
  }, {
    path: 'category/add',
    name: 'admin-category-add',
    meta: {
      title: '分类添加',
    },
    component: resolve => require(['@/views/admin/category/categoryAdd.vue'], resolve)
  }, {
    path: 'category/edit/:categoryId',
    name: 'admin-category-edit',
    meta: {
      title: '分类编辑',
    },
    component: resolve => require(['@/views/admin/category/categoryEdit.vue'], resolve)
  }, {
    path: 'content',
    name: 'admin-content',
    meta: {
      title: '文章首页',
    },
    component: resolve => require(['@/views/admin/content/content.vue'], resolve)
  }, {
    path: 'content/add',
    name: 'admin-content-add',
    meta: {
      title: '分类添加',
    },
    component: resolve => require(['@/views/admin/content/contentAdd.vue'], resolve)
  }, {
    path: 'content/edit/:contentId',
    name: 'admin-content-edit',
    meta: {
      title: '分类编辑',
    },
    component: resolve => require(['@/views/admin/content/contentEdit.vue'], resolve)
  }]
};

/*路由未匹配*/
const notFoundRouter = {
  path: '*',
  component: resolve => require(['@/views/notFound/notFound.vue'], resolve),
  name: 'notFound',
  meta: {
    title: '404-对不起！您访问的页面不存在'
  }
};

/*所有上面定义的路由合并下面的routes里*/
const routes = [
  homeRouter,
  contentDetailRouter,
  recommendCotentRouter,
  adminRouter,
  notFoundRouter,
  userInfoRouter,
  loginRouter,
  collectRouter
];

export default routes;
