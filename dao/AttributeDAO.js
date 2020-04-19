var path = require('path');
daoModule = require('./DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 获取参数列表
 * @param {*} cat_id 
 * @param {*} sel 
 * @param {*} cb 
 */
module.exports.list = function(cat_id, sel, cb){
    db = databaseModule.getDatabase();
    sql = "SELECT * FROM sp_attribute WHERE cat_id = ? AND attr_sel = ? AND delete_time is NULL";
    database.driver.execQuery(sql, [cat_id, sel],function(err, attributes){
        if(err) return cb('获取参数列表错误');
        cb(null, attributes);
    });
}