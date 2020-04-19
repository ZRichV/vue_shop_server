var _ = require('lodash');
var path = require('path');
var dao = require(path.join(process.cwd(), 'dao/DAO'));

/**
 * 判断是否删除
 * @param {*} keyCategoris 
 * @param {*} cat 
 */
function isDelete(keyCategoris, cat){
    if(cat.cat_pid == 0){
        return cat.cat_deleted;
    }else if(cat.cat_deleted){
        return true;
    }else{
        parentCat = keyCategoris[cat.cat_pid];
        if(!parentCat) return true;
        return isDelete(keyCategoris, parentCat);
    }
}

/**
 * 获取状态树结果
 * @param {*} keyCats 
 * @param {*} cats 
 * @param {*} type 
 */
function getTreeRes(keyCats, cats, type){
    var res = [];
    for(idx in cats){
        var cat = cats[idx];
        if(isDelete(keyCats, cat)) continue;
        if(cat.cat_pid == 0){
            res.push(cat);
        }else{
            if(cat.cat_level >= type) continue;
            var parentCat = keyCats[cat.cat_pid];
            if(!parentCat) continue;
            if(!parentCat.children) {
                parentCat["children"] = []
            }
            parentCat.children.push(cat);
        }
    }
    return res;
}

/**
 * 获取所有分类
 * @param {*} type 描述显示层级
 * @param {*} conditions 
 * @param {*} cb 
 */
module.exports.getAllCat = function(type, conditions, cb){
    dao.list("CategoryModel", {"cat_deleted": false}, function(err, cats){
        if(err) return cb('获取所有分类失败');
        var keyCategoris = _.keyBy(cats, 'cat_id');
        if(!type) type = 3;
        res = getTreeRes(keyCategoris, cats, type);
        if(conditions){
            count = res.length;
            pagesize = parseInt(conditions.pagesize);
            pagenum = parseInt(conditions.pagenum) - 1;
            res = _.take(_.drop(res, pagenum * pagesize), pagesize);
            var resData = {};
            resData["total"] = count;
            resData["pagenum"] = pagenum;
            resData['pagesize'] = pagesize;
            resData['result'] = res;
            return cb(null, resData);
        }
        cb(null, res);
    });
}

/**
 * 获取具体分类对象
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.getCatById = function(id, cb){
    dao.show("CategoryModel", id, function(err, cat){
        if(err) return cb('获取具体分类对象失败');
        cb(null, cat);
    });
}

/**
 * 添加分类
 * @param {*} cat 
 * @param {*} cb 
 */
module.exports.addCat = function(cat, cb){
    dao.create('CategoryModel', {
        'cat_pid': cat.cat_pid,
        'cat_name': cat.cat_name,
        'cat_level': cat.cat_level
    }, function(err, newCat){
        if(err) return cb('添加分类失败');
        cb(null, newCat);
    });
}

/**
 * 更新分类
 * @param {*} cat_id 
 * @param {*} newName 
 * @param {*} cb 
 */
module.exports.updateCat = function(cat_id, newName, cb){
    dao.update("CategoryModel", cat_id, {'cat_name': newName}, function(err, newCat){
        if(err) return cb('更新分类失败');
        cb(null, newCat);
    });
}

/**
 * 删除分类
 * @param {*} cat_id 
 * @param {*} cb 
 */
module.exports.deleteCat = function(cat_id, cb){
    dao.update("CategoryModel", cat_id, {'cat_deleted': true}, function(err, newCat){
        if(err) return cb('删除分类成功');
        cb(null, newCat);
    });
}