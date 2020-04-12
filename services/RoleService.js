var _ = require('lodash');
var path = require('path');
var dao = require(path.join(process.cwd(), "dao/DAO"));
var permissionAPIDAO = require(path.join(process.cwd(), "dao/PermissionAPIDAO"));

/**
 * 权限验证函数
 * @param {*} rid 
 * @param {*} serviceName 
 * @param {*} actionName 
 * @param {*} cb 
 */
module.exports.authRight = function(rid, serviceName, actionName, cb){
    permissionAPIDAO.authRight(rid, serviceName,actionName, function(err,pass){
        cb(err, pass);
    });
}