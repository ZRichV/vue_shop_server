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
	if (!conditions.pagenum) return cb('pagenum 参数不对');
	if(!conditions.pagesize) return cb('pagesize 参数不对');

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
				var role_name = manager.role_name;
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

/**
 * 创建管理员
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.createManager = function(params, cb){
	managerDao.exists(params.username, function(err, isExist){
		if(err) return cb(err);
		if(isExist) return cb("用户名已存在");
		managerDao.create({
			"mg_name": params.username,
			"mg_pwd": Password.hash(params.password),
			"mg_mobile": params.mobile,
			"mg_email": params.email,
			"mg_time": (Date.parse(new Date())/1000),
			"role_id": params.rid
		}, function(err, manager){
			if(err) return cb("创建管理员失败");
			result = {
				"id": manager.mg_id,
				"username": manager.mg_name,
				"mobile": manager.mg_mobile,
				"email": manager.mg_email,
				"role_id": manager.role_id,
				"create_time": manager.mg_time
			};
			cb(null, result);
		});
	});
}
/**
 * 更新管理员信息
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.updateManager = function(params, cb){
	managerDao.update({
		"mg_id": params.id,
		"mg_mobile": params.mobile,
		"mg_email": params.email
	}, function(err, manager){
		if(err) return cb(err);
		cb(null, {
			"id": manager.mg_id,
			"username": manager.mg_name,
			"role_id": manager.role_id,
			"mobile": manager.mg_mobile,
			"email": manager.mg_email
		});
	})
}

/**
 * 通过管理员的ID获取管理员信息
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.getManager = function(id, cb){
	managerDao.show(id, function(err, manager){
		if(err) return cb(err);
		if(!manager) return cb("该管理员不存在");
		cb(null, {
			"id": manager.mg_id,
			"username": manager.mg_name,
			"role_id": manager.role_id,
			"mobile": manager.mg_mobile,
			"email": manager.mg_email
		});
	});
}

/**
 * 通过管理员 ID 进行删除操作
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.deleteManager = function(id, cb){
	managerDao.destroy(id, function(err){
		if(err) return cb("通过管理员 ID 进行删除操作失败");
		cb(null);
	});
}

/**
 * 为管理员设置角色
 * @param {*} id 
 * @param {*} rid 
 * @param {*} cb 
 */
module.exports.setRole = function(id, rid, cb){
	managerDao.show(id, function(err, manager){
		if(err) return cb(errr);
		if(!manager) return cb("该管理员不存在");
		managerDao.update({
			"mg_id": manager.mg_id,
			"role_id": rid}, function(err,manager){
				if(err) return cb("设置管理员角色失败");
				cb(err,{
					"id": manager.mg_id,
					"username": manager.mg_name,
					"role_id": manager.role_id,
					"mobile": manager.mg_mobile,
					"email": manager.mg_email
				});
			});
		});
}

/**
 * 更新管理员状态
 * @param {*} id 
 * @param {*} state 
 * @param {*} cb 
 */
module.exports.updateMgState = function(id, state, cb){
	managerDao.show(id, function(err, manager){
		if(err) return cb(errr);
		if(!manager) return cb("该管理员不存在");
		managerDao.update({
			"mg_id": manager.mg_id,
			"mg_state": state}, function(err,manager){
				if(err) return cb("设置管理员状态失败");
				cb(err,{
					"id": manager.mg_id,
					"rid":manager.role_id,
					"username":manager.mg_name,
					"mobile":manager.mg_mobile,
					"email":manager.mg_email,
					"mg_state":manager.mg_state ? 1 : 0
				});
			});
		});
}