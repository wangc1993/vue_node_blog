/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 19:05:08
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-09-10 21:57:17
 */

let mongoose = require('mongoose');
/*举报模型类*/
module.exports = mongoose.model('tip', require('../schemas/tip.js'));