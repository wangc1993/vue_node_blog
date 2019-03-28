import axios from 'axios';
import util from '@/utils/utils.js';

let baseUrl = "http://10.3.11.200:8081";
/*获取用户列表*/
export const getUserList = params => {
  return axios.get(`${baseUrl}/admin/user`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取用户列表总数*/
export const getUserAllCount = params => {
  return axios.get(`${baseUrl}/admin/userTotal`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*删除用户*/
export const deleteUser = params => {
  return axios.get(`${baseUrl}/admin/user/delete`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*注册*/
export const register = params => {
  return axios.post(`${baseUrl}/api/register`, params)
}

/*登录*/
export const login = params => {
  return axios.post(`${baseUrl}/api/login`, params)
}

/*添加分类*/
export const addCategory = params => {
  return axios.post(`${baseUrl}/admin/category/add`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取分类列表(分页)*/
export const getCategoryList = params => {
  return axios.get(`${baseUrl}/admin/category`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取分类详情*/
export const categortDetail = params => {
  return axios.get(`${baseUrl}/admin/categoryDetail`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取分类列表总数*/
export const getCategoryAllCount = params => {
  return axios.get(`${baseUrl}/admin/categoryTotal`, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*删除分类*/
export const deleteCategory = params => {
  return axios.get(`${baseUrl}/admin/category/delete`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*更新对应分类*/
export const updateCategory = params => {
  return axios.post(`${baseUrl}/admin/category/update`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取所有分类*/
export const getCategoryAllList = params => {
  return axios.get(`${baseUrl}/categoryAllList`)
}

/*添加文章*/
export const addContent = params => {
  return axios.post(`${baseUrl}/admin/content/add`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取文章列表(分页)*/
export const getContentList = params => {
  return axios.get(`${baseUrl}/admin/content`, {
    params: params
  })
}

/*获取文章详情*/
export const contentDetail = params => {
  return axios.get(`${baseUrl}/admin/contentDetail`, {
    params: params
  })
}

/*获取文章总数*/
export const getContentAllCount = params => {
  return axios.get(`${baseUrl}/admin/contentTotal`, {
    params: params
  })
}

/*删除文章*/
export const deleteContent = params => {
  return axios.get(`${baseUrl}/admin/content/delete`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*更新对应文章*/
export const updateContent = params => {
  return axios.post(`${baseUrl}/admin/content/update`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*增加阅读*/
export const addView = params => {
  return axios.get(`${baseUrl}/admin/content/addView`, {
    params: params
  })
}

/*添加评论*/
export const addComment = params => {
  return axios.post(`${baseUrl}/api/addComment`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取评论总数*/
export const getComemntTotal = params => {
  return axios.get(`${baseUrl}/api/getComemntTotal`, {
    params: params
  })
}

/*获取评论列表*/
export const getComemntList = params => {
  return axios.get(`${baseUrl}/api/getComemntList`, {
    params: params
  })
}

/*获取对应评论的赞*/
export const getGoodTotal = params => {
  return axios.get(`${baseUrl}/api/getGoodTotal`, {
    params: params
  })
}

/*更新赞*/
export const updateGood = params => {
  return axios.post(`${baseUrl}/api/updateGood`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取对应评论的吐槽*/
export const getBadTotal = params => {
  return axios.get(`${baseUrl}/api/getBadTotal`, {
    params: params
  })
}

/*更新吐槽*/
export const updateBad = params => {
  return axios.post(`${baseUrl}/api/updateBad`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*不良内容举报*/
export const contentTip = params => {
  return axios.post(`${baseUrl}/api/contentTip`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*用户删除自己的评论*/
export const commentDel = params => {
  return axios.post(`${baseUrl}/api/commentDel`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*获取举报文章的总数*/
export const getTipAllCount = params => {
  return axios.get(`${baseUrl}/admin/getTipAllCount`, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*删除举报*/
export const deleteTip = params => {
  return axios.get(`${baseUrl}/admin/tip/delete`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取举报列表*/
export const getTipAllList = params => {
  return axios.get(`${baseUrl}/admin/tipAllList`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取在线人数（首次）*/
export const getOnlineCount = params => {
  return axios.get(`${baseUrl}/getOnlineCount`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*获取用户的收藏列表(其实就是得到用户信息)*/
export const getUserInfo = params => {
  return axios.get(`${baseUrl}/api/getUserInfo`, {
    headers: {
      'authorization': util.getCookie('authorization')
    },
    params: params
  })
}

/*收藏*/
export const collectContent = params => {
  return axios.post(`${baseUrl}/api/collect`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*取消收藏*/
export const cancelCollect = params => {
  return axios.post(`${baseUrl}/api/cancelCollect`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*更新用户信息*/
export const updateUserInfo = params => {
  return axios.post(`${baseUrl}/api/updateUserInfo`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/* 头像导入 */
export const fileUpload = params => {
  return axios.post(`${baseUrl}/api/fileUpload`, params, {
    headers: {
      'authorization': util.getCookie('authorization')
    }
  })
}

/*首页新闻(易源api)*/
export const getNews = params => {
  return axios.get('http://route.showapi.com/109-35', {
    params: params
  })
}

/*获取阅读排行*/
export const getContentSort = params => {
  return axios.get(`${baseUrl}/contentSort`, {
    params: params
  })
}

/*获取微信精选*/
export const getWeixinContent = params => {
  return axios.get(`${baseUrl}/weixinContent`, {
    params: params
  })
}
