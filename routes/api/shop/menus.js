var express = require('express');
var path = require('path');
var menuService = require(path.join(process.cwd(), "services/MenuService"));

var router = express.Router();

router.get("/", function (req, res, next) {
    menuService.getLeftMenus(req.userInfo, function (err, result) {
        if (err) return res.sendResult(null, 400, err);
        res.sendResult(result, 200, "获取菜单列表成功");
    });
});

module.exports = router;