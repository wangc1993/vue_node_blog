/*
 * @Author: Carrey Wang
 * @Date:   2018-08-16 16:44:42
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-12-07 20:39:01
 */
let util = {};
let responseData = {};
/*jwt*/
const jwt = require('jsonwebtoken');

/*定义签名*/
const secret = 'wcBlog';
/*生成token*/
util.setToken = (username) => {
    return jwt.sign({
        name: username
    }, secret, {
        expiresIn: '7d' //秒到期时间
    });
}

util.setResponse = (res, code, message) => {
    responseData.code = code;
    responseData.message = message;
    res.json(responseData);
}

module.exports = util;