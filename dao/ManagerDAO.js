var path = require('path');
var daoModule = require('./DAO');
var databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 *通过查询条件获取管理员对象
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.selectOne = function(conditions, cb){
    daoModule.selectOne("ManagerModel", conditions,cb);
}