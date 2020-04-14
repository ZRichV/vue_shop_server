var express = require('express');
var path = require('path');
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
//通过验证模块获取用户管理服务
var mgService = authorization.getService("ManagerService");

var router = express.Router();

//查询管理员列表
router.get("/", function (req, res, next) {
    if (!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null, 400, "pagenum 参数错误");
    if (!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误");
    next();
}, function (req, res, next) {
    mgService.getAllManagers({
        "query": req.query.query,
        "pagenum": req.query.pagenum,
        "pagesize": req.query.pagesize
    }, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "获取管理员列表成功");
    })(req, res, next);
}
);


module.exports = router;