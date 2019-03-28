/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 17:48:49
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-11-29 19:31:40
 */

/*后台模块*/
let express = require('express');
let router = express.Router();
/*通过模型类操作数据库*/
let User = require('../models/users.js');
let Category = require('../models/category.js');
let Content = require('../models/content.js');
let Tip = require('../models/tip.js');
/*工具类*/
let util = require('../util/util.js');

/*该路由使用的中间件*/
router.use((req, res, next) => {
    responseData = {}
    next();
});

/*获取用户的总数*/
router.get('/userTotal', (req, res, next) => {
    User.estimatedDocumentCount().then(totalCount => {
        if (totalCount) {
            responseData.code = 1;
            responseData.totalCount = totalCount;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '获取用户总数出错');
        }
    });
});

/*获取数据库用户列表*/
router.get('/user', (req, res, next) => {
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    User.find().limit(Number(req.query.pageSize)).skip(skip).then(userList => {
        if (userList) {
            responseData.code = 1;
            responseData.userList = userList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取用户列表出错');
    })
})

/*删除用户*/
router.get('/user/delete', (req, res, next) => {
    User.remove({
        _id: req.query.id
    }).then(info => {
        if (info) {
            util.setResponse(res, 1, '用户删除成功');
        } else {
            util.setResponse(res, 0, '用户删除失败');
        }
    })
})

/*添加分类*/
router.post('/category/add', (req, res, next) => {
    Category.findOne({
        categoryName: req.body.categoryName
    }).then(info => {
        if (info) {
            /*分类名已存在*/
            util.setResponse(res, 3, '分类名已存在');
            return;
        }
        return new Category({
            categoryName: req.body.categoryName
        }).save();
    }).then(saveInfo => {
        if (saveInfo) {
            /*添加成功*/
            util.setResponse(res, 1, '添加成功');
        } else {
            util.setResponse(res, 0, '添加失败');
        }
    });
})

/*获取分类的总数*/
router.get('/categoryTotal', (req, res, next) => {
    Category.estimatedDocumentCount().then(totalCount => {
        if (totalCount) {
            responseData.code = 1;
            responseData.totalCount = totalCount;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '获取分类总数出错');
        }
    });
});

/*获取数据库分类列表(分页)*/
router.get('/category', (req, res, next) => {
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    /*sort:排序，1升序，-1降序*/
    Category.find().sort({
        _id: -1
    }).limit(Number(req.query.pageSize)).skip(skip).then(categoryList => {
        if (categoryList) {
            responseData.code = 1;
            responseData.categoryList = categoryList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取分类列表出错');
    })
})

/*删除分类*/
router.get('/category/delete', (req, res, next) => {
    Category.remove({
        _id: req.query.id
    }).then(info => {
        if (info) {
            util.setResponse(res, 1, '分类删除成功');
        } else {
            util.setResponse(res, 0, '分类删除失败');
        }
    })
})

/*更新分类*/
router.post('/category/update', (req, res, next) => {
    Category.findOne({
        _id: req.body.id
    }).then(info => {
        if (info) {
            /*判断数据库中是个存在相同分类名*/
            Category.findOne({
                _id: {
                    $ne: req.body.id
                },
                categoryName: req.body.categoryName
            }).then(info => {
                if (info) {
                    util.setResponse(res, 3, '分类已经存在');
                } else {
                    /*更新分类*/
                    Category.update({
                        _id: req.body.id
                    }, {
                        categoryName: req.body.categoryName
                    }).then(update => {
                        if (update) {
                            util.setResponse(res, 1, '分类更新成功');
                        } else {
                            util.setResponse(res, 0, '分类更新失败');
                        }
                    })
                }
            })
        } else {
            util.setResponse(res, 3, '不存在对应分类');
        }
    })
})

/*获取对应分类信息（供编辑）*/
router.get('/categoryDetail', (req, res, next) => {
    Category.findOne({
        _id: req.query.categoryId
    }).then(category => {
        if (category) {
            responseData.code = 1;
            responseData.category = category;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取分类详情出错');
    })
})

/*添加文章*/
router.post('/content/add', (req, res, next) => {
    Content.findOne({
        title: req.body.title
    }).then(info => {
        if (info) {
            /*文章已存在*/
            util.setResponse(res, 3, '文章已存在');
            return;
        }
        return new Content({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.author,
            category: req.body.categoryId,
            addTime: req.body.addTime
        }).save();
    }).then(saveInfo => {
        if (saveInfo) {
            /*添加成功*/
            util.setResponse(res, 1, '添加成功');
        } else {
            util.setResponse(res, 0, '添加失败');
        }
    });
})

/*获取文章的总数*/
router.get('/contentTotal', (req, res, next) => {
    let where = {};
    if (req.query.categoryId) {
        where.category = req.query.categoryId
    }
    /*countDocuments可以设置查询条件*/
    Content.countDocuments(where).then(totalCount => {
        if (totalCount || totalCount === 0) {
            responseData.code = 1;
            responseData.totalCount = totalCount;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '获取文章总数出错');
        }
    });
});

/*获取文章列表(分页)*/
router.get('/content', (req, res, next) => {
    let where = {};
    if (req.query.categoryId) {
        where.category = req.query.categoryId
    }
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    /*sort:排序，1升序，-1降序*/
    /*populate参数对应的是content的key,获取联系表的的值*/
    Content.where(where).find().sort({
        _id: -1
    }).limit(Number(req.query.pageSize)).skip(skip).populate(['category', 'author']).then(contentList => {
        if (contentList) {
            responseData.code = 1;
            responseData.contentList = contentList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取文章列表出错');
    })
})

/*获取对应文章信息（供编辑/展示）*/
router.get('/contentDetail', (req, res, next) => {
    Content.findOne({
        _id: req.query.contentId
    }).populate(['category', 'author']).then(content => {
        if (content) {
            responseData.code = 1;
            responseData.content = content;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取文章详情出错');
    })
})

/*删除文章*/
router.get('/content/delete', (req, res, next) => {
    Content.remove({
        _id: req.query.id
    }).then(info => {
        if (info) {
            util.setResponse(res, 1, '文章删除成功');
        } else {
            util.setResponse(res, 0, '文章删除失败');
        }
    })
})

/*更新文章*/
router.post('/content/update', (req, res, next) => {
    Content.findOne({
        _id: req.body.id
    }).then(info => {
        if (info) {
            /*判断数据库中是个存在相同文章名*/
            Content.findOne({
                _id: {
                    /*$ne表示不相等*/
                    $ne: req.body.id
                },
                title: req.body.title
            }).then(info => {
                if (info) {
                    util.setResponse(res, 3, '文章已经存在');
                } else {
                    /*更新分类*/
                    Content.update({
                        _id: req.body.id
                    }, {
                        title: req.body.title,
                        description: req.body.description,
                        content: req.body.content,
                        category: req.body.categoryId,
                    }).then(update => {
                        if (update) {
                            util.setResponse(res, 1, '文章更新成功');
                        } else {
                            util.setResponse(res, 0, '文章更新失败');
                        }
                    })
                }
            })
        } else {
            util.setResponse(res, 3, '不存在对应文章');
        }
    })
})

/*增加阅读量*/
router.get('/content/addView', (req, res, next) => {
    Content.findOne({
        _id: req.query.id
    }).then(info => {
        if (info) {
            info.views += 1;
            return info.save();
        } else {
            util.setResponse(res, 0, '阅读失败');
            return;
        }
    }).then(save => {
        if (save) {
            util.setResponse(res, 1, '阅读成功');
        } else {
            util.setResponse(res, 0, '阅读失败');
        }
    })
})

/*获取举报的总数*/
router.get('/getTipAllCount', (req, res, next) => {
    Tip.estimatedDocumentCount().then(totalCount => {
        if (totalCount || totalCount === 0) {
            responseData.code = 1;
            responseData.totalCount = totalCount;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '获取举报总数出错');
        }
    });
});

/*获取举报列表(分页)*/
router.get('/tipAllList', (req, res, next) => {
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    /*sort:排序，1升序，-1降序*/
    Tip.find().sort({
        _id: -1
    }).limit(Number(req.query.pageSize)).skip(skip).populate(['reporter']).then(tipList => {
        if (tipList) {
            responseData.code = 1;
            responseData.tipList = tipList;
            res.json(responseData);
            return;
        }
        util.setResponse(res, 0, '获取举报列表出错');
    })
})

/*删除举报*/
router.get('/tip/delete', (req, res, next) => {
    Tip.remove({
        _id: req.query.id
    }).then(info => {
        if (info) {
            util.setResponse(res, 1, '举报删除成功');
        } else {
            util.setResponse(res, 0, '举报删除失败');
        }
    })
})

module.exports = router;