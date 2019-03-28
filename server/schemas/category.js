/*
 * @Author: Carrey Wang
 * @Date:   2018-08-14 18:51:19
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-08-19 14:13:58
 */

/*定义分类表结构*/
let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    categoryName: String
});