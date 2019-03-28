/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-09-13 16:20:44
 */

/*定义举报的数据结构（表）*/
let mongoose = require('mongoose');
let moment = require('moment');

module.exports = new mongoose.Schema({
    contentId: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'content'
    },
    reporter: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'user'
    },
    extra: String,
    reason: String,
    addTime: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
});