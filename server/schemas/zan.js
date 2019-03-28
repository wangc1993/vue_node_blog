/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-09-05 20:01:29
 */

/*定义赞的数据结构（表）*/
let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    commentId: {
        /*类型*/
        type: mongoose.Schema.Types.ObjectId,
        /*引用*/
        ref: 'comment'
    },
    username: String
});