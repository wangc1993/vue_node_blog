/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-08-21 12:26:20
 */

/*定义文章的数据结构（表）*/
let mongoose = require('mongoose');
let moment = require('moment');

module.exports = new mongoose.Schema({
    /*关联字段*/
    category: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'category'
    },
    author: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'user'
    },
    title: String,
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    addTime: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    views: {
        type: Number,
        default: 0
    }
});