//模块加载，要有顺序
/**
 * 1.导包
 * 2.创建一个Express应用
 * 3.body的json解析
 * 4.初始化数据库模块
 * 5.设置跨域和相应数据格式
 * 6.初始化统一响应机制
 * 7.初始化后台登录passport策略
 * 8.设置全局权限
 * 9.初始化路由
 * 10.富文本编辑器
 * 11.日志
 * 12.统一处理无响应
 * 
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path'); //处理文件路径功能
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');//日志请求中间件
var bodyParser = require('body-parser');
//路由加载
var mount = require('mount-routes') //根据路径来自动加载路由
    // var indexRouter = require('./routes/index');
    // var usersRouter = require('./routes/users');
var resextra = require('./modules/resextra');
var admin_passport = require('./modules/passport');
// 获取验证模块
var authorization = require(path.join(process.cwd(), '/modules/authorization'));
// var log4js = require('./modules/logger');
var logistics = require('./modules/Logistics.js');
var upload_config = require('config').get('upload_config');
var ueditor = require(path.join(process.cwd(), '/modules/ueditor'));
// 获取管理员逻辑模块
var loginService = require(path.join(process.cwd(), 'services/LoginService'));
// 获取角色服务模块
var roleService = require(path.join(process.cwd(), 'services/RoleService'));


var app = express(); //创建一个 Express 应用。express()是一个由express模块导出的入口（top-level）函数。

// view engine setup
// app.set('views', path.join(__dirname, 'views'));//设置views的目录,__dirname全局变量表示当前执行脚本所在的目录
// app.set('view engine', 'jade');//设置渲染引擎

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //设置图标
//app.use(logger('dev'));//日志设置，使用参见https://github.com/expressjs/morgan
//app.use(express.json());//解析JSON格式的post参数
//app.use(express.urlencoded({ extended: true }));//解析urlencoeded编码的post参数，URLEncoded编码中,所有的字符均为ANSCII码;ture:表示使用第三方模块qs来处理
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));//静态目录设置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 初始化数据库
var database = require('./modules/database');
database.initialize(app, function(err) {
    if (err) {
        console.error('连接数据库失败 %s', err);
    }
});

// 设置跨域和相应数据格式
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    if (req.method == 'OPTIONS') res.send(200);
    /*让options请求快速返回*/
    else next();
});

//为了能够使用res.sendResult，这娘们要放在全局权限设置前面
// 初始化统一响应机制
app.use(resextra);

// 这些个东西要放在全局权限设置前面
// 初始化 后台登录 passport 策略
// 设置登录模块的登录函数衔接 passport 策略
admin_passport.setup(app, loginService.login);
// 设置 passport 登录入口点
app.use('/api/shop/login', admin_passport.login);
// 设置 passport 验证路径
app.use('/api/shop/*', admin_passport.tokenAuth);

// 设置全局权限
authorization.setAuthFn(function(req, res, next, serviceName, actionName, passFn) {
    if (!req.userInfo || isNaN(parseInt(req.userInfo.rid))) return res.sendResult('无角色ID分配');
    //验证权限
    roleService.authRight(req.userInfo.rid, serviceName, actionName, function(err, pass) {
        passFn(pass);
    });
});

// 带路径的用法并且可以打印出路由表
mount(app, path.join(process.cwd(), '/routes'), true);

app.all('/ueditor/ue', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X_Requested_With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    if (req.method == 'OPTIONS') res.send(200);
    /*让options请求快速返回*/
    else next();
})

// 富文本控件处理qing q
app.use('/ueditor/ue', ueditor);
//. 设置富文本空间地址
app.use('/ueditor', express.static('public/ueditor'));
app.use('/tmp_uploads', express.static('tmp_uploads'));
app.use('/x/common', express.static('uploads/common'));
app.use('/uploads/goodspics', express.static('uploads/goodspics'));
app.use('/' + upload_config.get('upload_ueditor'), express.static(upload_config.get('upload_ueditor')));
//快递物流查询
app.get('/kuaidi/:orderno', logistics.getLogisticsInfo);

// log4js.use(app);

//原始的模块开始
// catch 404 and forward to error handler
//捕捉404错误并进行错误处理
app.use(function(req, res, next) {
    res.sendResult(null, 404, 'Not Found');
});

//error handler
//开发环境错误处理
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
//   res.json({
//     message: err.message,
//     error: err
//   });
// });

app.listen(3000, function() {
    console.log('port 3000 start!');
})

module.exports = app;