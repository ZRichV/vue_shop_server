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

// 添加用户
router.post("/", function(req, res, next){
    // 验证参数
    if(!req.body.username){
		return res.sendResult(null, 400, "用户名不能为空");
    }
    if(!req.body.password){
        return res.sendResult(null, 400, "密码不能为空");
    }
    if(!req.body.rid){
        req.body.rid = -1;
    }
    if(isNaN(parseInt(req.body.rid))){
        req.body.rid = -1;
    }
    next();
}, function(req, res, next){
    // 处理业务逻辑
    params = {
        "username": req.body.username,
        "password": req.body.password,
        "mobile": req.body.mobile,
        "email": req.body.email,
        "rid": req.body.rid
    }
    mgService.createManager(params, function(err, manager){
        if(err) return res.sendResult(null, 400, err);
        res.sendResult(manager, 201, "添加用户成功");
    })(req, res, next);
});

//修改用户状态
router.put("/:id/state/:state", function(req, res, next){
    //验证
    if(!req.params.id) {
        return res.sendResult(null, 400, "用户ID不能为空");
    }
    if(isNaN(parseInt(req.params.id))){
        return res.sendResult(null, 400, "用户ID必须是数字");
    }
    next();
}, function(req, res, next){
    //处理业务
    state = 0;
    if(req.params.state && req.params.state == "true") state = 1;
    mgService.updateMgState(req.params.id, state, function(err, manager){
        if(err) return res.sendResult(null, 400, err);
        res.sendResult(manager, 200, "修改用户状态成功");
    })(req, res, next);
});

// 根据 ID 查询用户信息
router.get("/:id", function(req, res, next){
    //验证
    if(!req.params.id) {
        return res.sendResult(null, 400, "用户ID不能为空");
    }
    if(isNaN(parseInt(req.params.id))){
        return res.sendResult(null, 400, "用户ID必须是数字");
    }
    next();
}, function(req, res, next){
    mgService.getManager(req.params.id, function(err, manager){
        if(err) return res.sendResult(null, 400, err);
        res.sendResult(manager, 200, "根据 ID 查询用户信息成功");
    })(req, res, next);
});

// 编辑用户提交
router.put("/:id", function(req, res, next){
    //验证
    if(!req.params.id) {
        return res.sendResult(null, 400, "用户ID不能为空");
    }
    if(isNaN(parseInt(req.params.id))){
        return res.sendResult(null, 400, "用户ID必须是数字");
    }
    next();
}, function(req, res, next){
    mgService.updateManager({
        "id": req.params.id,
        "mobile": req.body.mobile,
        "email": req.body.email
    }, function(err, manager){
        if(err) return res.sendResult(null, 400, err);
        res.sendResult(manager, 200, "编辑用户提交成功");
    })(req, res, next);
});

// 删除单个用户
router.delete("/:id", function(req, res, next){
    if(!req.params.id) {
        return res.sendResult(null, 400, "用户ID不能为空");
    }
    if(isNaN(parseInt(req.params.id))){
        return res.sendResult(null, 400, "用户ID必须是数字");
    }
    if(req.param.id == 500){
        return res.sendResult(null, 400, "不允许删除admin账户");
    }
    next();
}, function(req, res, next){
    mgService.deleteManager(req.params.id, function(err){
        if(err) return res.sendResult(null, 400, err);
        return res.sendResult(null, 200, "删除成功");
    })(req, res, next);
});

// 分配用户角色
router.put("/:id/role", function(req, res, next){
    if(!req.params.id) {
        return res.sendResult(null, 400, "用户ID不能为空");
    }
    if(isNaN(parseInt(req.params.id))){
        return res.sendResult(null, 400, "用户ID必须是数字");
    }
    if(req.param.id == 500){
        return res.sendResult(null, 400, "不允许修改admin账户");
    }
    if(!req.body.rid){
        res.sendResult(null, 400, "权限ID不能为空");
    }
    next();
}, function(req, res, next){
    mgService.setRole(req.params.id, req.body.rid, function(err, manager){
        if(err) return res.sendResult(null, 400, err);
        return res.sendResult(manager, 200, "分配用户角色成功");
    })(req, res, next);
});

module.exports = router;