var path = require('path');
var managerDao = require(path.join(process.cwd(), "dao/ManagerDAO"));
var Password = require("node-php-password");
var logger = require('../modules/logger').logger();

/**
 * 获取所有管理员
 * @param {*} conditions 
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param {*} cb 
 */
module.exports.getAllManagers = function (conditions, cb) {
	if (!conditions.papenum) return cb('pagenum 参数不对');
	if (!conditions.papesize) return cb('pagesize 参数不对');

	//通过关键词获取管理员数量
	managerDao.countByKey(conditions["query"], function (err, count) {
		if (err) return cb(err);
		key = conditions["query"];
		pageNum = parseInt(conditions["pagenum"]);
		pageSize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pageSize);
		offset = (pageNum -1) * pageSize;
		if(offset >= count){
			offset = count;
		}
		limit = pageSize;

		managerDao.selectByKey(key, offset, limit, function(err, managers){
			var retManagers = [];
			for(idx in managers){
				var manager = managers[idx];
				var role_name = managers.role_name;
				if(!manager.role_id){
					role_name = "超级管理员";
				}
				retManagers.push({
					"id": manager.mg_id,
					"role_name":role_name,
					"username":manager.mg_name,
					"create_time":manager.mg_time,
					"mobile":manager.mg_mobile,
					"email":manager.mg_email,
					"mg_state":manager.mg_state == 1
				});
			}
			var resDate = {};
			resDate["total"] = count;
			resDate["pagenum"] = pageNum;
			resDate["users"] = retManagers;
			cb(err, resDate);
		});
	});
}