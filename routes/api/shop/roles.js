var express = require('express');
var path = require('path');
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var roleServ = authorization.getService("RoleService");

var router = express.Router();

// 角色列表
router.get("/", function (req, res, next) {
    next();
}, function (req, res, next) {
    roleServ.getAllRoles(function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "获取角色列表成功");
    })(req, res, next);
});

// 添加角色
router.post("/", function (req, res, next) {
    if (!req.body.roleName) return res.sendResult(null, 400, "角色名称不能为空");
    next();
}, function (req, res, next) {
    roleServ.createRole({
        "roleName": req.body.roleName,
        "roleDesc": req.body.roleDesc
    }, function (err, role) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(role, 201, "创建成功");
    })(req, res, next);
});

// 根据 ID 查询角色
router.get("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "角色ID不能为空");
    if (isNaN(parseInt(req.params.id))) res.sendResult(null, 400, "角色ID必须为数字");
    next();
}, function (req, res, next) {
    roleServ.getRoleById(req.params.id, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "根据 ID 查询角色成功");
    })(req, res, next);
});

// 编辑提交角色
router.put("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "角色ID不能为空");
    if (isNaN(parseInt(req.params.id))) res.sendResult(null, 400, "角色ID必须为数字");
    if (!req.body.roleName) return res.sendResult(null, 400, "角色名称不能为空");
    next();
}, function (req, res, next) {
    roleServ.updateRole({
        "id": req.params.id,
        "roleName": req.body.roleName,
        "roleDesc": req.body.roleDesc
    }, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "获取成功");
    })(req, res, next);
});

// 删除角色
router.delete("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "角色ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "角色ID必须为数字");
    next();
}, function (req, res, next) {
    roleServ.deleteRole(req.params.id, function (err, success) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(null, 200, "删除成功");
    })(req, res, next);
});

// 角色授权
router.post("/:roleId/rights", function (req, res, next) {
    if (!req.params.roleId) return res.sendResult(null, 400, "角色ID不能为空");
    if (isNaN(parseInt(req.params.roleId))) return res.sendResult(null, 400, "角色ID必须为数字");
    next();
}, function (req, res, next) {
    roleServ.updateRoleRight(req.params.roleId, req.body.rids, function (err, newRole) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(newRole, 200, "角色授权成功");
    })(req, res, next);
});

// 删除角色指定权限
router.delete("/:roleId/rights/:rightId", function (req, res, next) {
    if (!req.params.roleId) return res.sendResult(null, 400, "角色ID不能为空");
    if (isNaN(parseInt(req.params.roleId))) res.sendResult(null, 400, "角色ID必须为数字");
    if (isNaN(parseInt(req.params.rightId))) return res.sendResult(null, 400, "角色名称不能为空");
    next();
}, function (req, res, next) {
    roleServ.deleteRoleRight(req.params.roleId, req.params.rightId, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "删除角色指定权限成功");
    })(req, res, next);
});

module.exports = router;
