/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-10-23 10:43:19
 */

/*定义评论的数据结构（表）*/
let mongoose = require('mongoose');
let moment = require('moment');

module.exports = new mongoose.Schema({
    content: String,
    userId: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'user'
    },
    contentId: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'content'
    },
    addTime: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
});