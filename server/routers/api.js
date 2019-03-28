/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 17:47:55
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-12-07 20:34:31
 */

/*api模块*/
let express = require('express');
let router = express.Router();
/*一个Node.js模块，用于解析表单数据，尤其是文件上传。*/
let formidable = require('formidable');
let path = require('path');
let fs = require('fs');
/*通过用户模型类操作数据库*/
let User = require('../models/users.js');
let Comment = require('../models/comment.js');
let Good = require('../models/zan.js');
let Bad = require('../models/bad.js');
let Tip = require('../models/tip.js');
let Content = require('../models/content.js');
/*工具类*/
let util = require('../util/util.js');

/*该路由使用的中间件*/
router.use((req, res, next) => {
    responseData = {}
    next();
});

/*注册*/
router.post('/register', (req, res, next) => {
    /*判断用户名是否存在*/
    User.findOne({
        username: req.body.username
    }).then(userInfo => {
        if (userInfo) {
            util.setResponse(res, 2, '用户名已存在');
            return;
        }
        /*用户名不存在,保存数据库*/
        let user = new User({
            username: req.body.username,
            password: req.body.password
        });
        /*返回promise对象*/
        return user.save();
    }).then(saveInfo => {
        /*判断是否保存成功*/
        if (saveInfo) {
            util.setResponse(res, 1, '注册成功');
        } else {
            util.setResponse(res, 0, '注册失败');
        }
    })
});

/*登录*/
router.post('/login', (req, res, next) => {
    /*判断用户名是否存在*/
    User.findOne({
        username: req.body.username
    }).then(userInfo => {
        if (userInfo) {
            if (req.body.password === userInfo.password) {
                responseData.code = 1;
                responseData.userInfo = userInfo;
                responseData.authToken = 'Bearer ' + util.setToken(req.body.username);
                res.json(responseData);
            } else {
                util.setResponse(res, 3, '密码错误');
            }
        } else {
            util.setResponse(res, 0, '用户不存在');
        }
    })
})

/*添加评论*/
router.post('/addComment', (req, res, next) => {
    new Comment({
        userId: req.body.userId,
        content: req.body.content,
        contentId: req.body.contentId,
        addTime: req.body.addTime
    }).save().then(save => {
        if (save) {
            util.setResponse(res, 1, '评论发表成功');
        } else {
            util.setResponse(res, 0, '评论发表失败');
        }
    })
})

/*获取评论总数*/
router.get('/getComemntTotal', (req, res, next) => {
    let where = {};
    where.contentId = req.query.contentId;
    Comment.countDocuments(where).then(info => {
        if (info || info === 0) {
            responseData.code = 1;
            responseData.commentTotal = info;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '评论总数获取失败');
        }
    })
})

/*获取评论列表*/
router.get('/getComemntList', (req, res, next) => {
    let where = {};
    where.contentId = req.query.contentId;
    /*计算忽略的条数*/
    let skip = (req.query.currentPage - 1) * req.query.pageSize;
    Comment.where(where).populate('userId').find().limit(Number(req.query.pageSize)).skip(skip).sort({
        _id: -1
    }).then(info => {
        if (info) {
            responseData.code = 1;
            responseData.commentList = info;
            res.json(responseData);
        } else {
            util.setResponse(res, 0, '评论获取失败');
        }
    })
})

/*为了同步for操作*/
async function getGoodTotal(req, res, next) {
    let goodTotalArr = [];
    for (let i = 0; i < req.query.commentIdArr.length; i++) {
        let where = {};
        where.commentId = req.query.commentIdArr[i];
        await Good.countDocuments(where).then(info => {
            if (info || info === 0) {
                goodTotalArr.push(info);
                if (i === req.query.commentIdArr.length - 1) {
                    responseData.code = 1;
                    responseData.goodTotalArr = goodTotalArr;
                    res.json(responseData);
                }
            } else {
                util.setResponse(res, 0, '评论赞获取失败');
            }
        })
    }
}

/*获取对应评论赞的数量*/
router.get('/getGoodTotal', (req, res, next) => {
    getGoodTotal(req, res, next);
})

/*更新赞*/
router.post('/updateGood', (req, res, next) => {
    Good.findOne({
        commentId: req.body.commentId,
        username: req.body.username
    }).then(good => {
        if (good) {
            /*用户已经赞过对应的评论*/
            Good.remove({
                _id: good._id
            }).then(info => {
                if (info) {
                    /*成功取消对应的赞*/
                    util.setResponse(res, 1, '赞取消成功');
                } else {
                    util.setResponse(res, 0, '赞取消失败');
                }
            })
        } else {
            /*用户没有赞过对应评论*/
            let good = new Good({
                commentId: req.body.commentId,
                username: req.body.username
            });
            good.save().then(saveInfo => {
                if (saveInfo) {
                    /*赞保存成功*/
                    util.setResponse(res, 1, '赞保存成功');
                } else {
                    util.setResponse(res, 0, '赞保存失败');
                }
            });
        }
    })
})

/*为了同步for操作*/
async function getBadTotal(req, res, next) {
    let badTotalArr = [];
    for (let i = 0; i < req.query.commentIdArr.length; i++) {
        let where = {};
        where.commentId = req.query.commentIdArr[i];
        await Bad.countDocuments(where).then(info => {
            if (info || info === 0) {
                badTotalArr.push(info);
                if (i === req.query.commentIdArr.length - 1) {
                    responseData.code = 1;
                    responseData.badTotalArr = badTotalArr;
                    res.json(responseData);
                }
            } else {
                util.setResponse(res, 0, '评论吐槽获取失败');
            }
        })
    }
}

/*获取对应评论吐槽的数量*/
router.get('/getBadTotal', (req, res, next) => {
    getBadTotal(req, res, next);
})

/*更新吐槽*/
router.post('/updateBad', (req, res, next) => {
    Bad.findOne({
        commentId: req.body.commentId,
        username: req.body.username
    }).then(bad => {
        if (bad) {
            /*用户已经吐槽过对应的评论*/
            Bad.remove({
                _id: bad._id
            }).then(info => {
                if (info) {
                    /*成功取消对应的赞*/
                    util.setResponse(res, 1, '吐槽取消成功');
                } else {
                    util.setResponse(res, 0, '吐槽取消失败');
                }
            })
        } else {
            /*用户没有吐槽过对应评论*/
            let bad = new Bad({
                commentId: req.body.commentId,
                username: req.body.username
            });
            bad.save().then(saveInfo => {
                if (saveInfo) {
                    /*吐槽保存成功*/
                    util.setResponse(res, 1, '吐槽保存成功');
                } else {
                    util.setResponse(res, 0, '吐槽保存失败');
                }
            });
        }
    })
})

/*不良信息*/
router.post('/contentTip', (req, res, next) => {
    let tip = new Tip({
        reporter: req.body.userId,
        contentId: req.body.contentId,
        reason: req.body.reason,
        extra: req.body.extra,
    });
    tip.save().then(saveInfo => {
        if (saveInfo) {
            util.setResponse(res, 1, '举报成功');
        } else {
            util.setResponse(res, 0, '举报失败');
        }
    })
})

/*用户删除自己的评论*/
router.post('/commentDel', (req, res, next) => {
    Comment.remove({
        _id: req.body.commentId
    }).then(info => {
        if (info) {
            util.setResponse(res, 1, '删除成功');
        } else {
            util.setResponse(res, 0, '删除失败');
        }
    })
})

/*获取用户信息*/
router.get('/getUserInfo', (req, res, next) => {
    if (req.query.type) {
        User.findOne({
            _id: req.query.userId
        }).populate('collectList').then(userInfo => {
            if (userInfo) {
                let responseData = {};
                responseData.code = 1;
                responseData.userInfo = userInfo;
                res.json(responseData);
            } else {
                util.setResponse(res, 0, '用户不存在');
            }
        })
    } else {
        User.findOne({
            _id: req.query.userId
        }).then(userInfo => {
            if (userInfo) {
                let responseData = {};
                responseData.code = 1;
                responseData.userInfo = userInfo;
                res.json(responseData);
            } else {
                util.setResponse(res, 0, '用户不存在');
            }
        })
    }
})

/*更新方法*/
function updateUser(updateInfo, req, res) {
    if (updateInfo) {
        console.log(updateInfo);
        User.findOne({
            _id: req.body.userId
        }).then(info => {
            if (info) {
                /*更新用户信息*/
                User.update({
                    _id: req.body.userId
                }, updateInfo).then(update => {
                    if (update) {
                        util.setResponse(res, 1, '用户更新成功');
                    } else {
                        util.setResponse(res, 0, '用户更新失败');
                    }
                })
            } else {
                util.setResponse(res, 3, '不存在对应用户');
            }
        })
    }
}

/*更新用户信息*/
router.post('/updateUserInfo', (req, res, next) => {
    let updateInfo = '';
    if (req.body.username) {
        /*判断用户名是否存在*/
        User.findOne({
            username: req.body.username
        }).then(info => {
            if (info) {
                util.setResponse(res, 2, '用户名已存在');
                return;
            }
            updateInfo = {
                username: req.body.username
            };
            updateUser(updateInfo, req, res);
        })
    } else {
        updateInfo = {
            password: req.body.password
        };
        updateUser(updateInfo, req, res);
    }
})

/*收藏*/
router.post('/collect', (req, res, next) => {
    User.update({
        _id: req.body.userId
    }, {
        '$push': {
            collectList: req.body.contentId
        }
    }).then(update => {
        if (update) {
            util.setResponse(res, 1, '收藏成功');
        } else {
            util.setResponse(res, 0, '收藏失败');
        }
    })
})

/*取消收藏*/
router.post('/cancelCollect', (req, res, next) => {
    User.findOne({
        _id: req.body.userId
    }).then(info => {
        if (info) {
            /*更新数组中的字符串（如果数组中是对象的话可以用$pull方法）*/
            let index = info.collectList.indexOf(req.body.contentId);
            if (index > -1) {
                info.collectList.splice(index, 1);
                return info.save();
            } else {
                util.setResponse(res, 0, '取消收藏失败');
                return;
            }
        } else {
            util.setResponse(res, 0, '取消收藏失败');
            return;
        }
    }).then(update => {
        if (update) {
            util.setResponse(res, 1, '取消收藏成功');
        } else {
            util.setResponse(res, 0, '取消收藏失败');
        }
    })
})

/*上传头像*/
router.post('/fileUpload', (req, res, next) => {
    let form = new formidable.IncomingForm();
    /*设置上传文件夹,path.normalize(p)由于该方法属于path模块，使用前需要引入path模块（var path= require(“path”) ）*/
    form.uploadDir = path.normalize(__dirname + '/../avatar/');
    form.parse(req, function(err, fields, files) {
        let extname = path.extname(files.file.name);
        let oldPath = files.file.path;
        let newPath = path.normalize(__dirname + '/../avatar/') + '/' + fields.userId + extname;
        fs.rename(oldPath, newPath, function(err) {
            if (err) {
                util.setResponse(res, 0, '头像上传失败');
            } else {
                User.findOne({
                    _id: fields.userId
                }).then(info => {
                    if (info) {
                        /*更新用户信息*/
                        User.update({
                            _id: fields.userId
                        }, {
                            avatar: fields.userId + extname
                        }).then(update => {
                            if (update) {
                                util.setResponse(res, 1, '头像更新成功');
                            } else {
                                util.setResponse(res, 0, '头像更新失败');
                            }
                        })
                    } else {
                        util.setResponse(res, 3, '不存在对应用户');
                    }
                })
            }
        });
    });
})

module.exports = router;