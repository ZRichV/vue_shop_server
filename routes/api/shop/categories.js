var express = require('express');
var router = express.Router();
var path = require("path");
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var catServ = authorization.getService("CategoryService");
var attrServ = authorization.getService("AttributeService");

// 商品分类数据列表
router.get('/', function (req, res, next) {
    if (!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null, 400, "pagenum 参数错误");
    if (!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误");
    next();
}, function (req, res, next) {
    var conditions = null;
    if (req.query.pagenum && req.query.pagesize) {
        conditions = {
            "pagenum": req.query.pagenum,
            "pagesize": req.query.pagesize
        };
    }
    catServ.getAllCat(req.query.type, conditions, function (err, result) {
        if (err) return res.sendResult(null, 400, '获取商品分类数据列表失败');
        res.sendResult(result, 200, '获取成功');
    })(req, res, next);
});

// 添加分类
router.post('/', function (req, res, next) {
    if (!req.body.cat_name) return res.sendResult(nul, 400, '分类名称不能为空');
    next();
}, function (req, res, next) {
    catServ.addCategory({
        "cat_pid": req.body.cat_pid,
        "cat_name": req.body.cat_name,
        "cat_level": req.body.cat_level
    }, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 201, "添加分类成功");
    })(req, res, next);
});

// 根据 id 查询分类
router.get("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    next();
}, function (req, res, next) {
    catServ.getCatById(req.params.id, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "根据 id 查询分类成功");
    })(req, res, next);
});

// 编辑提交分类
router.put("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.body.cat_name || req.body.cat_name == "") return res.sendResult(null, 400, "分类名称不能为空");
    next();
}, function (req, res, next) {
    catServ.updateCat(req.params.id, req.body.cat_name, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "编辑提交分类成功");
    })(req, res, next);
});

// 删除分类
router.delete("/:id", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    next();
}, function (req, res, next) {
    catServ.deleteCat(req.params.id, function (msg) {
        res.sendResult(null, 200, msg);
    })(req, res, next);
});

// 参数列表:通过参数方式查询静态参数还是动态参数
router.get("/:id/attributes", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.query.sel || (req.query.sel != "only" && req.query.sel != "many")) {
        return res.sendResult(null, 400, "属性类型必须设置");
    }
    next();
}, function (req, res, next) {
    attrServ.getAttributes(req.params.id, req.query.sel, function (err, attributes) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(attributes, 200, "获取成功");
    })(req, res, next);
});

// 添加动态参数或者静态属性
router.post("/:id/attributes", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.body.attr_name) return res.sendResult(null, 400, "参数名称不能为空");
    if (!req.body.attr_sel || (req.body.attr_sel != "only" && req.body.attr_sel != "many")) {
        return res.sendResult(null, 400, "参数 attr_sel 类型必须为 only 或 many");
    }
    /*
    if(!req.body.attr_write || (req.body.attr_write != "manual" && req.body.attr_write != "list")) {
        return res.sendResult(null,400,"参数的 attr_write 必须为 manual 或 list");
    }*/
    next();
}, function (req, res, next) {
    attrServ.createAttribute({
        "attr_name": req.body.attr_name,
        "cat_id": req.params.id,
        "attr_sel": req.body.attr_sel,
        "attr_write": req.body.attr_sel == "many" ? "list" : "manual",//req.body.attr_write,
        "attr_vals": req.body.attr_vals ? req.body.attr_vals : ""
    }, function (err, attr) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(attr, 201, "添加动态参数或者静态属性成功");
    })(req, res, next);
});

// 删除参数
router.delete("/:id/attributes/:attrId", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.params.attrId) return res.sendResult(null, 400, "参数ID不能为空");
    if (isNaN(parseInt(req.params.attrId))) return res.sendResult(null, 400, "参数ID必须是数字");
    next();
}, function (req, res, next) {
    attrServ.deleteAttribute(req.params.attrId, function (err, newAttr) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(newAttr, 200, "删除参数成功");
    })(req, res, next);
});

// 根据 ID 查询参数
router.get("/:id/attributes/:attrId", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.params.attrId) return res.sendResult(null, 400, "参数ID不能为空");
    if (isNaN(parseInt(req.params.attrId))) return res.sendResult(null, 400, "参数ID必须是数字");
    next();
}, function (req, res, next) {
    attrServ.attributeById(req.params.attrId, function (err, attr) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(attr, 200, "根据 ID 查询参数成功");
    })(req, res, next);
});

// 编辑提交参数
router.put("/:id/attributes/:attrId", function (req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "分类ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "分类ID必须是数字");
    if (!req.params.attrId) return res.sendResult(null, 400, "参数ID不能为空");
    if (isNaN(parseInt(req.params.attrId))) return res.sendResult(null, 400, "参数ID必须是数字");
    if (!req.body.attr_sel || (req.body.attr_sel != "only" && req.body.attr_sel != "many")) {
        return res.sendResult(null, 400, "参数 attr_sel 类型必须为 only 或 many");
    }
    if (!req.body.attr_name || req.body.attr_name == "") return res.sendResult(null, 400, "参数名称不能为空");
    next();
}, function (req, res, next) {
    attrServ.updateAttribute(
        req.params.attrId, {
        "attr_name": req.body.attr_name,
        "cat_id": req.params.id,
        "attr_sel": req.body.attr_sel,
        "attr_write": req.body.attr_sel == "many" ? "list" : "manual",//req.body.attr_write,
        "attr_vals": req.body.attr_vals ? req.body.attr_vals : ""
    }, function (err, newAttr) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(newAttr, 200, "编辑提交参数成功");
    })(req, res, next);
});

// 

module.exports = router;