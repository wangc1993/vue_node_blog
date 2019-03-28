/*
 * @Author: Carrey Wang
 * @Date:   2018-08-13 13:46:43
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2018-12-07 21:05:15
 */
/*加载express模块*/
let express = require('express');
/*加载应用模板*/
let swig = require('swig');
/*加载数据库模块*/
let mongoose = require('mongoose');
/*加载body-parser解析模块*/
let bodyParser = require('body-parser');
/*express中jwt的处理模块*/
let expressJwt = require('express-jwt');

/*配置模板*/
swig.setDefaults({
    cache: false
}); //开发过程中，取消模板缓存（不要重启node）

/*创建app*/
let app = express();
/*socket.io公式*/
let http = require('http').Server(app);
let io = require('socket.io')(http);
/*在线人数统计*/
let onlineCount = 0;
/*解决跨域*/
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCrossDomain);

/*设置路由中间件，静态页面。将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了,就像apache里的www下的文件*/
app.use('/avatar', express.static('./avatar'));
/*设置静态页面*/
/*app.use('/public', express.static(__dirname + '/public'));*/

/*设置body解析*/
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


/*获取在线人数*/
app.use('/getOnlineCount', (req, res, next) => {
    let responseData = {};
    responseData.onlineCount = onlineCount;
    res.json(responseData);
})

/*使用中间件验证token合法性*/
app.use(expressJwt({
    secret: 'wcBlog',
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({
    path: ['/weixinContent', '/categoryAllList', '/contentSort', '/api/login', '/api/register', '/api/getComemntTotal', '/api/getComemntList', '/api/getGoodTotal', '/api/getBadTotal', '/api/contentTip', '/api/getUserInfo', '/admin/contentTotal', '/admin/content', '/admin/contentDetail', '/admin/content/addView'] //除了这些地址，其他的URL都需要验证
}));

/*加载路由模块*/
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

/*监听连接事件*/
io.on('connection', function(socket) {
    /*发送给客户端在线人数*/
    io.emit('connected', ++onlineCount);
    /*接收*/
    socket.on('chatting', function(data) {
        /*发送出去（广播）*/
        io.emit('chatting', data);
    });
    /*当有用户断开*/
    socket.on('disconnect', function() {
        /*重新发送给客户端在线人数*/
        io.emit('disconnected', --onlineCount);
    });
});

/*连接数据库*/
mongoose.connect('mongodb://localhost:27017/admin', {
    useNewUrlParser: true
}, function(err) {
    if (err) {
        console.log("数据库连接失败！");
    } else {
        console.log("数据库连接成功！");
        /*监听8081端口*/
        /*警告：app.listen（80）在这里socket不起作用！*/
        http.listen(8081);
    }
});