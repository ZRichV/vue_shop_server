var path = require('path');
var daoModule = require('./DAO');
var databaseModule = require(path.join(process.cwd(), "modules/database"));

/**
 *通过查询条件获取管理员对象
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.selectOne = function (conditions, cb) {
    daoModule.selectOne("ManagerModel", conditions, cb);
}

/**
 * 创建管理员
 * @param {*} obj 
 * @param {*} cb 
 */
module.exports.create = function (obj, cb) {
    daoModule.create("ManagerModel", obj, cb);
}

/**
 * 获取管理员列表
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.list = function (conditions, cb) {
    daoModule.list("ManagerModel", conditions, function (err, models) {
        if (err) return cd(err, null);
        cb(null, models);
    });
}

/**
 * 通过林俊杰的关键词获取管理员对象
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.selectByKey = function (key, offset, limit, cb) {
    sql = "select * from sp_manager as smg left join sp_role as sr on smg.role_id = sr.role_id";
    if (key) {
        sql += " where mg_name like ? limit ?,?";
        database.driver.execQuery(sql, ["%" + key + "%", offset, limit], function (err, managers) {
            if (err) return cb("通过林俊杰的关键词获取管理员对象出错");
            cb(null, managers);
        });
    } else {
        sql += " limit ?,? ";
        database.driver.execQuery(sql, [offset, limit], function (err, managers) {
            if (err) return cb("不通过林俊杰的关键词获取管理员对象出错");
            cb(null, managers);
        });
    }
}

/**
 * 判断管理员是否存在
 * @param {*} username 
 * @param {*} cb 
 */
module.exports.exists = function (username, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models.ManagerModel;
    Model.exists({ "mg_name": username }, function (err, isExist) {
        if (err) return cb("判断管理员是否存在失败");
        cb(null, isExist);
    });
}

/**
 * 模糊查询用户数量
 * @param {*} key 
 * @param {*} cb 
 */
module.exports.countByKey = function (key, cb) {
    sql = "select count(*) as count from sp_manager";
    if (key) {
        sql += " where mg_name like ?";
        database.driver.execQuery(sql, ["%" + key + "%"], function (err, result) {
            if (err) return cb("模糊查询用户数量错误");
            cb(null, result[0]["count"]);
        });
    } else {
        database.driver.execQuery(sql, function (err, result) {
            if (err) return cb("模糊查询用户数量错误");
            cb(null, result[0]["count"]);
        });
    }
}

/**
 * 通过ID获取管理员数据
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.show = function (id, cb) {
    daoModule.show("ManagerModel", id, cb);
}

/**
 * 更新管理员信息
 * @param {*} obj 
 * @param {*} cb 
 */
module.exports.update = function (obj, cb) {
    daoModule.update("ManagerModel", obj.mg_id, obj, cb);
}

/**
 * 删除管理员数据
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.destroy = function (id, cb) {
    daoModule.destroy("ManagerModel", id, function (err) {
        if (err) return cb(err);
        return cb(null);
    });
}

/**
 * 保存管理员信息
 * @param {*} obj 
 * @param {*} cb 
 */
module.exports.save = function (obj, cb) {
    daoModule.show(obj.mg_id, function (err, oldObj) {
        if (err) {
            daoModule.create("ManagerModel", obj, cb);
        } else { 
            daoModule.update("ManagerModel", obj.mg_id, obj, cb);
        }
    });
}

/**
 * 获取管理员数量
 * @param {*} cb 
 */
module.exports.count = function(cb){
    daoModule("ManagerModel", cb);
}