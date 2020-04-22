var express = require('express');
var path = require('path');
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var goodServ = authorization.getService("GoodService");

var router = express.Router();

// 商品列表数据
router.get("/", function(req, res, next) {
    if (!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null, 400, 'pagenum 参数错误');
    if (!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, 'pagesize 参数错误');
    next();
}, function(req, res, next) {
    var conditions = {
        "pagenum": req.query.pagenum,
        "pagesize": req.query.pagesize
    };
    if (req.query.query) {
        conditions["query"] = req.query.query;
    }
    goodServ.getAllGoods(conditions, function(err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "获取商品列表数据成功");
    })(req, res, next);
});

// 添加商品
router.post("/", function(req, res, next) {
    next();
}, function(req, res, next) {
    var params = req.body;
    goodServ.createGood(params, function(err, newGood) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(newGood, 201, "添加商品成功");
    })(req, res, next);
});

// 根据 ID 查询商品
router.get("/:id", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    next();
}, function(req, res, next) {
    goodServ.getGoodById(req.params.id, function(err, good) {
        if (err) return res.sendResult(null, 400, err);
        return res.sendResult(good, 200, "根据 ID 查询商品成功");
    })(req, res, next);
});

// 编辑提交商品
router.put("/:id", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    next();
}, function(req, res, next) {
    var params = req.body;
    goodServ.updateGood(req.params.id, params, function(err, newGood) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(newGood, 200, "创建商品成功");
    })(req, res, next);
});

// 删除商品
router.delete("/:id", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    next();
}, function(req, res, next) {
    goodServ.deleteGood(req.params.id, function(err) {
        if (err) return res.sendResult(null, 400, "删除商品失败");
        return res.sendResult(null, 200, "删除商品成功");
    })(req, res, next);
});

// 同步商品图片
router.put("/:id/pics", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    next();
}, function(req, res, next) {
    goodServ.updatePics(req.params.id, req.body, function(err, good) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(good, 200, "同步商品图片成功");
    })(req, res, next);
});

// 同步商品属性
router.put("/:id/attributes", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    next();
}, function(req, res, next) {
    goodServ.updateAttributes(req.params.id, req.body, function(err, good) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(good, 200, "同步商品属性成功");
    })(req, res, next);
});

// 更新商品状态
router.put("/:id/state/:state", function(req, res, next) {
    if (!req.params.id) return res.sendResult(null, 400, "商品ID不能为空");
    if (isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "商品ID必须是数字");
    if (!req.params.state) return res.sendResult(null, 400, "状态值不能为空");
    if (req.params.state != 0 && req.params.state != 1 && req.params.state != 2) {
        return res.sendResult(null, 400, "状态值只能为 0 ，1 或 2");
    }
    next();
}, function(req, res, next) {
    goodServ.updateState(req.params.id, req.params.state, function(err, good) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(good, 200, "更新商品状态成功");
    })(req, res, next);
});

module.exports = router;