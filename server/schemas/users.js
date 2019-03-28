/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-11-29 19:13:55
 */

/*定义用户的数据结构（表）*/
let mongoose = require('mongoose');
let moment = require('moment');

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: ''
    },
    /*收藏*/
    collectList: [{
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'content'
    }],
    /*是否是管理员*/
    isAdmin: {
        type: Boolean,
        default: false
    },
    addTime: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
});