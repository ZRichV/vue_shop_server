var path = require('path');

// 获取数据库模型
var databaseModule = require(path.join(process.cwd(), "modules/database"));
var logger = require('../modules/logger').logger();

/**
 * 创建对象数据
 * 
 * @param {*} modelName 模型名称
 * @param {*} obj 模型对象
 * @param {*} cb 回调函数
 */
module.exports.create = function (modelName, obj, cb) {
    var db = databaseModule.getDatabase();
    var model = db.models[modelName];
    model.create(obj, cb);
}

/**
 * 获取一条数据
 * @param {*} modelName 
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.selectOne = function (modelName, conditions, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.model[modeName];
    if (!Model) return cb("模型不存在", null);
    if (!conditions) return cb("条件为空", null);
    Model.one(conditions, function (err, obj) {
        logger.debug(err);
        if (err) {
            return cb("查询失败", null);
        }
        return cd(null, obj);
    });
}