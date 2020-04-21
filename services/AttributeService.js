var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var attributeDao = require(path.join(process.cwd(), "dao/AttributeDAO"));

/**
 * 获取属性列表
 * @param {*} cat_id 
 * @param {*} sel 
 * @param {*} cb 
 */
module.exports.getAttributes = function(cat_id, sel, cb) {
    attributeDao.list(cat_id, sel, function(err, attributes) {
        if (err) return cb('获取属性列表失败');
        cb(null, attributes);
    });
}

/**
 * 创建参数
 * @param {*} info 
 * @param {*} cb 
 */
module.exports.createAttribute = function(info, cb) {
    dao.create("AttributeModel", info, function(err, attribute) {
        if (err) return cb("创建参数失败");
        cb(null, attribute);
    });
}

/**
 * 更新参数
 * @param {*} attrId 
 * @param {*} info 
 * @param {*} cb 
 */
module.exports.updateAttribute = function(attrId, info, cb) {
    dao.update('AttributeModel', attrId, info, function(err, newAttr) {
        if (err) return cb(err);
        cb(null, _.omit(newAttr, "deleted_time"));
    });
}

/**
 * 删除参数
 * @param {*} attrId 
 * @param {*} cb 
 */
module.exports.deleteAttribute = function(attrId, cb) {
    dao.update('AttributeModel', attrId, {
        "delete_time": parseInt((Date.now() / 1000))
    }, function(err, newAttr) {
        if (err) return cb('删除参数失败');
        cb(null, newAttr);
    });
}

/**
 * 根据ID获取参数
 * @param {*} attrId 
 * @param {*} cb 
 */
module.exports.attributeById = function(attrId, cb) {
    dao.show('AttributeModel', attrId, function(err, attr) {
        if (err) return cb(err);
        cb(null, _.omit(attr, "delete_time"));
    });
}