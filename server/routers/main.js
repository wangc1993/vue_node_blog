/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 17:48:57
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-12-15 19:10:39
 */

/*首页模块*/
let express = require('express');
let axios = require('axios');
let router = express.Router();

let Category = require('../models/category.js');
let Content = require('../models/content.js');
/*工具类*/
let util = require('../util/util.js');

/*该路由使用的中间件*/
router.use((req, res, next) => {
    responseData = {}
    next();
});

/*获取所有分类*/
router.get('/categoryAllList', (req, res, next) => {
    /*sort:排序，1升序，-1降序*/
    Category.find().sort({
        _id: 1
    }).then(categoryAllList => {
        if (categoryAllList) {
            responseData.code = 1;
            responseData.categoryAllList = categoryAllList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取所有分类出错');
    })
})

/*获取阅读排行*/
router.get('/contentSort', (req, res, next) => {
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    /*sort:排序，1升序，-1降序*/
    /*populate参数对应的是content的key,获取联系表的的值*/
    Content.find().sort({
        views: -1
    }).limit(Number(req.query.pageSize)).populate(['category', 'author']).skip(skip).then(contentSortList => {
        if (contentSortList) {
            responseData.code = 1;
            responseData.contentSortList = contentSortList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取阅读排行出错');
    })
})

/*获取微信精选(第三方)*/
router.get('/weixinContent', (req, res, next) => {
    let Res = res;
    axios.get('http://v.juhe.cn/weixin/query', {
        params: {
            key: '9e9d4e2c26a09cc590e7e4346bb9f79a',
            ps: Number(req.query.size)
        }
    }).then(res => {
        if (res.data.error_code === 0) {
            responseData.code = 1;
            responseData.weixinList = res.data.result.list;
            Res.json(responseData);
            return;
        } else {
            util.setResponse(Res, 0, '获取微信精选出错');
        }
    }).catch(err => {
        util.setResponse(Res, 0, '获取微信精选出错');
    })
})

module.exports = router;