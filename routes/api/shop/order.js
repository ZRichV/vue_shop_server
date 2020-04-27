var express = require('express');
var router = express.Router();
var path = require("path");
// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
// 通过验证模块获取分类管理
var orderServ = authorization.getService("OrderService");

// 订单数据列表
router.get("/", function(req, res, next) {
    if (!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null, 400, "pagenum 参数错误");
    if (!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误");
    next();
}, function(req, res, next) {
    var conditions = {
        "pagenum": req.query.pagenum,
        "pagesize": req.query.pagesize
    };

    if (req.query.user_id) {
        conditions["user_id"] = req.query.user_id;
    }
    if (req.query.pay_status) {
        conditions["pay_status"] = req.query.pay_status;
    }
    if (req.query.is_send) {
        conditions["is_send"] = req.query.is_send;
    }
    if (req.query.order_fapiao_title) {
        conditions["order_fapiao_title"] = req.query.order_fapiao_title;
    }
    if (req.query.order_fapiao_company) {
        conditions["order_fapiao_company"] = req.query.order_fapiao_company;
    }
    if (req.query.order_fapiao_content) {
        conditions["order_fapiao_content"] = req.query.order_fapiao_content;
    }
    if (req.query.consignee_addr) {
        conditions["consignee_addr"] = req.query.consignee_addr;
    }

    orderServ.getAllOrders(conditions, function(err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "订单数据列表成功");
    })(req, res, next);
});

// 创建新订单
router.post("/", function(req, res, next) {
    next();
}, function(req, res, next) {
    var params = req.body;
    orderServ.createOrder(params, function(err, newOrder) {
        if (err) return res.sendResult(null, 400, err);
        return res.sendResult(newOrder, 201, "创建新订单成功");
    })(req, res, next)
});

// 修改订单状态
router.put("/:id", function(req, res, next) {
    next();
}, function(req, res, next) {
    var params = req.body;
    orderServ.updateOrder(req.params.id, params, function(err, newOrder) {
        if (err) return res.sendResult(null, 400, err);
        return res.sendResult(newOrder, 201, "修改订单状态成功");
    })(req, res, next);
});

// 查看订单详情
router.get("/:id", function(req, res, next) {
    orderServ.getOrder(req.params.id, function(err, result) {
        if (err) return res.sendResult(null, 400, err);
        return res.sendResult(result, 200, "查看订单详情成功");
    })(req, res, next);
});

module.exports = router;