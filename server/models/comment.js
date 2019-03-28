/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 19:05:08
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-08-22 10:49:27
 */

let mongoose = require('mongoose');
/*评论模型类*/
module.exports = mongoose.model('comment', require('../schemas/comment.js'));