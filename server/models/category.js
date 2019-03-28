/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 19:05:08
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-08-19 14:14:33
 */

let mongoose = require('mongoose');
/*用户模型类*/
module.exports = mongoose.model('category', require('../schemas/category.js'));