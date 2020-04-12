var createError = require('http-errors');
var express = require('express');
var path = require('path');//处理文件路径功能
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');//日志请求中间件
var bodyParser = require('body-parser')
//路由加载
var mount = require('mount-routes')//根据路径来自动加载路由
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var resextra = require('./modules/resextra')
var admin_passport = require('./modules/passport')

var app = express();//创建一个 Express 应用。express()是一个由express模块导出的入口（top-level）函数。

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置views的目录,__dirname全局变量表示当前执行脚本所在的目录
app.set('view engine', 'jade');//设置渲染引擎

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
mount(app, path.join(process.cwd(), '/routes'), true);

// 初始化数据库
var database = require('./modules/database');
database.initialize(app, function (err) {
  if (err) {
    console.error('连接数据库失败 %s', err);
  }
})

// 获取验证模块
var authorization = require(path.join(process.cwd(), '/modules/authorization'));
// 设置全局权限
authorization.setAuthFn(function (req, res, next, serviceName, actionName, passFn) {
  if (!req.userInfo || isNaN(parseInt(req.userInfo.rid))) return res.sendResult('无角色ID分配');
  //验证权限
  roleService.authRight(req.userInfo.rid, serviceName, actionName, function (err, pass) {
    passFn(pass);
  });
})

// 设置跨域和相应数据格式
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == 'OPTIONS') res.send(200)
  /*让options请求快速返回*/ else next()
})

// 初始化统一响应机制
app.use(resextra);

// 初始化 后台登录 passport 策略
// 设置登录模块的登录函数衔接 passport 策略
//admin_passport.setup(app, managerService.login);
// 设置 passport 登录入口点
app.use('/login', admin_passport.login);
// 设置 passport 验证路径
app.use('/*', admin_passport.tokenAuth);

//原始的模块开始
// catch 404 and forward to error handler
//捕捉404错误并进行错误处理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
//开发环境错误处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function () {
  console.log('port 3000 star!');
})

module.exports = app;
