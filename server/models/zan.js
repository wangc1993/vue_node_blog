/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 19:05:08
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-09-05 19:55:46
 */

let mongoose = require('mongoose');
/*赞模型类*/
module.exports = mongoose.model('zan', require('../schemas/zan.js'));