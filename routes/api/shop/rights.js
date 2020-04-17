var express = require('express');
var path = require('path');
var authorization = require(path.join(process.cwd(),"/modules/authorization"));
var rightService = authorization.getService('RightService');

var router = express.Router();

router.get("/:type", function(req, res, next){
    if(!req.params.type){
        return res.sendResult(null, 400, "显示类型未定义");
    }
    if(req.params.type != 'list' && req.params.type != 'tree'){
        return res.sendResult(null, 400, "显示类型参数错误");
    }
    next();
}, function(req, res, next){
    rightService.getAllRights(req.params.type, function(err, rights){
        if(err) return res.sendResult(null, 400, err);
        res.sendResult(rights, 200, "获取权限列表成功");
    })(req, res, next);
});

module.exports = router;