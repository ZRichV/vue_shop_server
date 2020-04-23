var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var goodAttributeDao = require(path.join(process.cwd(), "dao/GoodAttributeDAO"));
var orm = require("orm");
var Promise = require("bluebird");
var fs = require("fs");
var gm = require("gm");
var uniqid = require('uniqid');
var upload_config = require('config').get("upload_config");

/**
 * 裁剪图片
 * @param {*} srcPath 
 * @param {*} savePath 
 * @param {*} newWidth 
 * @param {*} newHeight 
 */
function clipImage(srcPath, savePath, newWidth, newHeight) {
    return new Promise(function(resolve, reject) {
        // gm(srcPath).resize(newWidth, newHeight).autoOrient().write(savePath, function(err) {
        //     if (err) reject(err);
        //     resolve();
        // });
        readable = fs.createReadStream(srcPath);
        writable = fs.createWriteStream(savePath);
        readable.pipe(writable);
        readable.on('end', function() {
            resolve();
        });
    });
}

/**
 * 通过参数生成产品基本信息
 * @param {*} params 
 */
function generateGoodInfo(params) {
    return new Promise(function(resolve, reject) {
        var info = {};
        if (params.goods_id) info['goods_id'] = params.goods_id;
        if (!params.goods_name) return reject('商品名称不能为空');
        info['goods_name'] = params.goods_name;
        if (!params.goods_price) return reject("商品价格不能为空");
        var price = parseFloat(params.goods_price);
        if (isNaN(price) || price < 0) return reject("商品价格不正确")
        info["goods_price"] = price;
        if (!params.goods_number) return reject("商品数量不能为空");
        var num = parseInt(params.goods_number);
        if (isNaN(num) || num < 0) return reject("商品数量不正确");
        info["goods_number"] = num;
        if (!params.goods_cat) return reject("商品没有设置所属分类");
        var cats = params.goods_cat.split(',');
        if (cats.length > 0) {
            info["cat_one_id"] = cats[0];
        }
        if (cats.length > 1) {
            info["cat_two_id"] = cats[1];
        }
        if (cats.length > 2) {
            info["cat_three_id"] = cats[2];
            info["cat_id"] = cats[2];
        }
        if (params.goods_weight) {
            weight = parseFloat(params.goods_weight);
            if (isNaN(weight) || weight < 0) return reject("商品重量格式不正确");
            info["goods_weight"] = weight;
        } else {
            info["goods_weight"] = 0;
        }
        if (params.goods_introduce) {
            info["goods_introduce"] = params.goods_introduce;
        }

        if (params.goods_big_logo) {
            info["goods_big_logo"] = params.goods_big_logo;
        } else {
            info["goods_big_logo"] = "";
        }
        if (params.goods_small_logo) {
            info["goods_small_logo"] = params.goods_small_logo;
        } else {
            info["goods_small_logo"] = "";
        }

        if (params.goods_state) {
            info["goods_state"] = params.goods_state;
        }
        // 图片
        if (params.pics) {
            info["pics"] = params.pics;
        }

        // 属性
        if (params.attrs) {
            info["attrs"] = params.attrs;
        }

        info["add_time"] = Date.parse(new Date()) / 1000;
        info["upd_time"] = Date.parse(new Date()) / 1000;
        info["is_del"] = '0';

        if (params.hot_mumber) {
            hot_num = parseInt(params.hot_mumber);
            if (isNaN(hot_num) || hot_num < 0) return reject("热销品数量格式不正确");
            info["hot_mumber"] = hot_num;
        } else {
            info["hot_mumber"] = 0;
        }

        info["is_promote"] = info["is_promote"] ? info["is_promote"] : false;

        resolve(info);
    });
}

/**
 * 检查商品名称是否重复
 * @param {*} info 
 */
function checkGoodName(info) {
    return new Promise(function(resolve, reject) {
        dao.selectOne('GoodModel', {
            "goods_name": info.goods_name,
            "is_del": "0"
        }, function(err, good) {
            if (err) return reject(err);
            if (!good) return resolve(info);
            if (good.goods_id == info.goods_id) return resolve(info);
            return reject('商品名称已经存在');
        });
    });
}

/**
 * 创建商品基本信息
 * 
 * @param {*} info 
 */
function createGoodInfo(info) {
    return new Promise(function(resolve, reject) {
        dao.create('GoodModel', _.clone(info), function(err, newGood) {
            if (err) return reject("创建商品基本信息失败");
            newGood.goods_cat = newGood.getGoodsCat();
            info.good = newGood;
            return resolve(info);
        });
    });
}

/**
 * 更新商品基本信息
 * @param {*} info 
 */
function updateGoodInfo(info) {
    return new Promise(function(resolve, reject) {
        if (!info.goods_id) return reject("商品ID不存在");
        dao.update("GoodModel", info.goods_id, _.clone(info), function(err, newGood) {
            if (err) return reject("更新商品基本信息失败");
            info.good = newGood;
            return resolve(info);
        });

    });
}

/**
 * 获取商品对象
 * 
 * @param  {[type]} info 查询内容
 * @return {[type]}      [description]
 */
function getGoodInfo(info) {
    return new Promise(function(resolve, reject) {
        if (!info || !info.goods_id || isNaN(info.goods_id)) return reject("商品ID格式不正确");
        dao.show("GoodModel", info.goods_id, function(err, good) {
            if (err) return reject("获取商品基本信息失败");
            good.goods_cat = good.getGoodsCat();
            info["good"] = good;
            return resolve(info);
        });
    });
}

/**
 * 删除商品图片
 * 
 * @param  {[type]} pic 图片对象
 * @return {[type]}     [description]
 */
function removeGoodPic(pic) {
    return new Promise(function(resolve, reject) {
        if (!pic || !pic.remove) return reject("删除商品图片记录失败");
        pic.remove(function(err) {
            if (err) return reject("删除失败");
            resolve();
        });
    });
}

/**
 * 移除图片文件
 * fs.unlink 异步地删除文件或符号链接
 * @param {*} path 
 */
function removeGoodPicFile(path) {
    return new Promise(function(resolve, reject) {
        fs.unlink(path, function(err, result) {
            resolve();
        });
    });
}

/**
 * 添加商品图片
 * @param {*} pic 
 */
function createGoodPic(pic) {
    return new Promise(function(resolve, reject) {
        if (!pic) return reject("图片对象不能为空");
        var GoodPicModel = dao.getModel("GoodPicModel");
        GoodPicModel.create(pic, function(err, newPic) {
            if (err) return reject("创建图片数据失败");
            resolve();
        });
    });
}

/**
 * 更新图片
 * @param {*} info 
 */
function updateGoodPics(info) {
    return new Promise(function(resolve, reject) {
        var good = info.good;
        if (!good.goods_id) return reject('更新商品图片ID错误');
        if (!info.pics) return resolve(info);
        dao.list("GoodPicModel", {
            "columns": { "goods_id": good.goods_id }
        }, function(err, oldpics) {
            if (err) return reject("获取图片列表失败");
            var batchFns = [];
            var newpics = info.pics ? info.pics : [];
            var newpicsKV = _.keyBy(newpics, 'pics_id');
            var oldpicsKv = _.keyBy(oldpics, 'pics_id');
            // 保存图片合集
            var addNewpics = [];
            var reservedOldpics = [];
            var delOldpics = [];
            // 如果提交的新的数据中有老的数据的pics_id就说明保留数据，否则就删除
            _(oldpics).forEach(pic => {
                if (newpicsKV[pic.pics_id]) {
                    reservedOldpics.push(pic);
                } else {
                    delOldpics.puch(pic);
                }
            });
            // 从新提交的数据中检索出需要新创建的数据
            // 计算逻辑如果提交的数据不存在 pics_id 字段说明是新创建的数据
            _(newpics).forEach(pic => {
                if (!pic.pics_id && pic.pic) {
                    addNewpics.push(pic);
                }
            });
            // 开始处理商品图片数据逻辑
            // 1. 删除商品图片数据集合
            _(delOldpics).forEach(pic => {
                // 1.1 删除图片的物理路径
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.pics_big)));
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.pics_mid)));
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.pics_sma)));
                // 1.2 数据库中删除图片数据记录
                batchFns.push(removeGoodPic(pic));
            });
            // 2. 处理新建图片的集合
            _(addNewpics).forEach(pic => {
                if (!pic.pics_id && pic.pic) {
                    // 2.1 通过原始图片路径裁剪出需要的图片
                    var src = path.join(process.cwd(), pic.pic)
                    var tmp = src.split(path.sep);
                    var filename = tmp[tmp.length - 1];
                    pic.pics_big = "/uploads/goodspics/big_" + filename;
                    pic.pics_mid = "/uploads/goodspics/mid_" + filename;
                    pic.pics_sma = "/uploads/goodspics/sma_" + filename;
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.pics_big), 800, 800));
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.pics_mid), 400, 400));
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.pics_sma), 200, 200));
                    pic.goods_id = good.goods_id;
                    // 2.2 数据库中新建数据记录
                    batchFns.push(createGoodPic(pic));
                }
            });
            if (batchFns.length == 0) {
                return resolve(info);
            }
            // 批量执行所有操作
            Promise.all(batchFns).then(function() {
                resolve(info);
            }).catch(function(error) {
                if (error) return reject(error);
            });
        });
    });
}

/**
 * 添加商品属性
 * @param {*} goodAttribute 
 */
function createGoodAttribute(goodAttribute) {
    return new Promise(function(resolve, reject) {
        dao.create("GoodAttributeModel", _.omit(goodAttribute, "delete_time"), function(err, newAttr) {
            if (err) return reject("创建商品参数失败");
            resolve(newAttr);
        });
    });
}

/**
 * 更新商品属性
 * @param {*} info 
 */
function updateGoodAttrs(info) {
    return new Promise(function(resolve, reject) {
        var good = info.good;
        if (!good.goods_id) return reject("获取商品图片必须先获取商品信息");
        if (!info.attrs) return resolve(info);
        goodAttributeDao.clearGoodAttrs(good.goods_id, function(err) {
            if (err) return reject('清理原始的商品参数失败');
            var newAttrs = info.attrs ? info.attrs : [];
            if (newAttrs) {
                var createFns = [];
                _(newAttrs).forEach(newAttr => {
                    newAttr.goods_id = good.goods_id;
                    if (newAttr.attr_value) {
                        if (newAttr.attr_value instanceof Array) {
                            newAttr.attr_value = newAttr.attr_value.join(',');
                        } else {
                            newAttr.attr_value = newAttr.attr_value;
                        }
                    } else {
                        newAttr.attr_value = '';
                    }
                    createFns.push(createGoodAttribute(_.clone(newAttr)));
                });
            }
            if (createFns.length == 0) {
                return resolve(info);
            }

            Promise.all(createFns).then(function() {
                resolve(info);
            }).catch(function(error) {
                if (error) return reject(error);
            });
        });
    });
}

/**
 * 挂载图片
 * @param {*} info 
 */
function getAllPics(info) {
    return new Promise(function(resolve, reject) {
        var good = info.good;
        if (!good.goods_id) return reject("没有商品id");
        // 3. 组装最新的数据挂载在“info”中“good”对象下
        dao.list('GoodPicModel', {
            "columns": { 'goods_id': good.goods_id }
        }, function(err, goodPics) {
            if (err) return reject("获取所有商品图片列表失败");
            _(goodPics).forEach(pic => {
                if (pic.pics_big.indexOf('http') == 0) {
                    pic.pics_big_url = pic.pics_big;
                } else {
                    pic.pics_big_url = upload_config.get("baseURL") + pic.pics_big;
                }
                if (pic.pics_mid.indexOf("http") == 0) {
                    pic.pics_mid_url = pic.pics_mid;
                } else {
                    pic.pics_mid_url = upload_config.get("baseURL") + pic.pics_mid;
                }
                if (pic.pics_sma.indexOf("http") == 0) {
                    pic.pics_sma_url = pic.pics_sma;
                } else {
                    pic.pics_sma_url = upload_config.get("baseURL") + pic.pics_sma;
                }
            });
            info.good.pics = goodPics;
            resolve(info);
        });
    });
}

/**
 * 挂载属性
 * @param  {[type]} info [description]
 * @return {[type]}      [description]
 */
function getAllAttrs(info) {
    return new Promise(function(resolve, reject) {
        var good = info.good;
        if (!good.goods_id) return reject("商品ID不能为空");
        goodAttributeDao.list(good.goods_id, function(err, goodAttrs) {

            if (err) return reject("获取所有商品参数列表失败");
            info.good.attrs = goodAttrs;
            resolve(info);
        });
    });
}

/**
 * 创建商品
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.createGood = function(params, cb) {
    generateGoodInfo(params)
        .then(checkGoodName)
        .then(createGoodInfo)
        .then(updateGoodPics)
        .then(updateGoodAttrs)
        .then(getAllPics)
        .then(getAllAttrs)
        .then(function(info) {
            cb(null, info.good);
        }).catch(err => {
            cb(err);
        });
}

/**
 * 删除商品
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.deleteGood = function(id, cb) {
    if (!id) return cb("商品ID不能为空");
    if (isNaN(id)) return cb('产品ID必须为数字');
    dao.update("GoodModel", id, {
        'is_del': '1',
        'delete_time': Date.parse(new Date()) / 1000,
        'upd_time': Date.parse(new Date()) / 1000
    }, function(err) {
        if (err) return cb(err);
        cb(null);
    });
}

/**
 * 获取商品列表
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.getAllGoods = function(params, cb) {
    var conditions = {};
    if (!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误");
    if (!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误");
    conditions['columns'] = {};
    if (params.query) {
        conditions['columns']['goods_name'] = orm.like("%" + params.query + "%");
    }
    conditions['columns']['is_del'] = '0';
    dao.countByConditions("GoodModel", conditions, function(err, count) {
        if (err) return cb(err);
        pagesize = params.pagesize;
        pagenum = params.pagenum;
        pageCount = Math.ceil(count / pagesize);
        offset = (pagenum - 1) * pagesize;
        if (offset >= count) {
            offset = count;
        }
        limit = pagesize;

        conditions["offset"] = offset;
        conditions["limit"] = limit;
        conditions["only"] = ["goods_id", "goods_name", "goods_price", "goods_weight", "goods_state", "add_time", "goods_number", "upd_time", "hot_mumber", "is_promote"];
        conditions["order"] = "-add_time";

        dao.list('GoodModel', conditions, function(err, goods) {
            if (err) return cb(err);
            var resultDate = {};
            resultDate['total'] = count;
            resultDate['pagenum'] = pagenum;
            resultDate['goods'] = _.map(goods, function(good) {
                return _.omit(good, "goods_introduce", "is_del", "goods_big_logo", "goods_small_logo", "delete_time");
            });
            cb(err, resultDate);
        });
    });
}

/**
 * 更新商品
 * @param {*} id 
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.updateGood = function(id, params, cb) {
    params.goods_id = id;
    generateGoodInfo(params)
        .then(checkGoodName)
        .then(updateGoodInfo)
        .then(updateGoodPics)
        .then(updateGoodAttrs)
        .then(getAllPics)
        .then(getAllAttrs)
        .then(info => {
            cb(null, info.good);
        }).catch(err => {
            cb(err);
        });
}

/**
 * 更新商品图片
 * @param {*} goods_id 
 * @param {*} pics 
 * @param {*} cb 
 */
module.exports.updatePics = function(goods_id, pics, cb) {
    if (!goods_id) return cb("商品ID不能为空");
    if (isNaN(goods_id)) return cb("商品ID必须为数字");
    getGoodInfo({
            'goods_id': goods_id,
            'pics': pics
        }).then(updateGoodPics)
        .then(getAllPics)
        .then(getAllAttrs)
        .then(info => {
            cb(null, info.good);
        }).catch(err => {
            cb(err);
        });
}

/**
 * 更新商品参数
 * @param {*} goods_id 
 * @param {*} attrs 
 * @param {*} cb 
 */
module.exports.updateAttrs = function(goods_id, attrs, cb) {
    getGoodInfo({
            'goods_id': goods_id,
            'attrs': attrs
        }).then(updateGoodAttrs)
        .then(getAllPics)
        .then(getAllAttrs)
        .then(info => {
            cb(null, info.good);
        }).catch(err => {
            cb(err);
        });
}

/**
 * 更新商品状态
 * @param {*} goods_id 
 * @param {*} state 
 * @param {*} cb 
 */
module.exports.updateState = function(goods_id, state, cb) {
    getGoodInfo({
            'goods_id': goods_id,
            'goods_state': state
        }).then(updateGoodInfo)
        .then(getAllPics)
        .then(getAllAttrs)
        .then(info => {
            cb(null, info.good);
        }).catch(function(err) {
            cb(err);
        });
}

/**
 * 通过商品ID获取商品数据
 * 
 * @param  {[type]}   id 商品ID
 * @param  {Function} cb 回调函数
 */
module.exports.getGoodById = function(id, cb) {
    getGoodInfo({ "goods_id": id })
        .then(getAllPics)
        .then(getAllAttrs)
        .then(info => {
            cb(null, info.good);
        })
        .catch(err => {
            cb(err);
        });
}