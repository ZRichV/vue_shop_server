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
    var Model = db.models[modelName];
    Model.create(obj, cb);
}

/**
 * 获取一条数据
 * @param {*} modelName 
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.selectOne = function (modelName, conditions, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    if (!Model) return cb("模型不存在", null);
    if (!conditions) return cb("条件为空", null);
    Model.one(conditions, function (err, obj) {
        logger.debug(err);
        if (err) {
            return cb("查询失败", null);
        }
        return cb(null, obj);
    });
}

/**
 * 通过主键ID获取对象
 * @param {*} modelName 
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.show = function (modelName, id, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    Model.get(id, function (err, obj) {
        cb(err, obj);
    });
}

/**
 * 获取所有数据
 * @param {*} modelName 
 * @param {*} conditions 
 * 查询条件统一规范
 * conditions
	{
		"columns" : {
			字段条件
			"字段名" : "条件值"
		},
		"offset" : "偏移",
		"omit" : ["字段"],
		"only" : ["需要字段"],
		"limit" : "",
		"order" :[ 
			"字段" , A | Z,
			...
		]
	}
 * @param {*} cb 
 */
module.exports.list = function (modelName, conditions, cb) {
    var db = databaseModule.getDatabase();
    var model = db.models[modelName];
    if (!model) return cb("模型不存在", null);
    if (conditions) {
        if (conditions["columns"]) {
            model = model.find(conditions["columns"]);
        } else {
            model = model.find();
        }
        if (conditions["offset"]) {
            model = model.offset(parseInt(conditions["offset"]));
        }
        if (conditions["limit"]) {
            model = model.limit(parseInt(conditions["limit"]));
        }
        if (conditions["only"]) {
            model = model.only(conditions["only"]);
        }
        if (conditions["omit"]) {
            model = model.omit(conditions["omit"]);
        }
        if (conditions["order"]) {
            mdoel = model.order(conditions["order"]);
        }
    } else {
        model = model.find();
    }
    model.run(function (err, models) {
        if (err) {
            console.log(err);
            return cb("查询失败", null);
        }
        cb(null, models);
    });
}

/**
 * 判断是否存在
 * @param {*} modelName 
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.exists = function (modelName, conditions, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    Model.exists(conditions, function (err, isExist) {
        if (err) return cb("判断是否存在失败");
        cb(null, isExist);
    });
}

/**
 * 更新对象数据
 * @param {*} modelName 
 * @param {*} id 
 * @param {*} updateObj 
 * @param {*} cb 
 */
module.exports.update = function (modelName, id, updateObj, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    Model.get(id, function (err, obj) {
        if (err) return cb("更新失败", null);
        obj.save(updateObj, cb);
    });
}

/**
 * 删除对象
 * @param {*} modelName 
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.destroy = function (modelName, id, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    Model.get(id, function (err, obj) {
        if (err) return cb("没有要删除对象的ID");
        obj.remove(function (err) {
            if (err) return cb("删除失败");
            return cb(null);
        });
    });
}

/**
 * 获取数量
 * @param {*} modelName 
 * @param {*} cb 
 */
module.exports.count = function (modelName, cb) {
    var db = databaseModule.getDatabase();
    var Model = db.models[modelName];
    Model.count(cb);
}

//
module.exports.getModel = function (modelName) {
    var db = databaseModule.getDatabase();
    return db.models[modelName];
}

/**
 * 根据条件查询数量
 * @param {*} modelName 
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.countByConditions = function (modelName, conditions, cb) {
    var db = databaseModule.getDatabase();

    var model = db.models[modelName];

    if (!model) return cb("模型不存在", null);

    var resultCB = function (err, count) {
        if (err) {
            return cb("查询失败", null);
        }
        cb(null, count);
    }

    if (conditions) {
        if (conditions["columns"]) {
            model = model.count(conditions["columns"], resultCB);
        } else {
            model = model.count(resultCB);
        }

    } else {
        model = model.count(resultCB);
    }

};