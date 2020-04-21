var path = require("path");
daoModule = require("./DAO");
databaseModule = require(path.join(process.cwd(), "modules/database"));

/**
 * 根据ID删除商品参数
 * @param {*} goods_id 
 * @param {*} cb 
 */
module.exports.clearGoodAttrs = function(goods_id, cb) {
    db = databaseModule.getDatabase();
    sql = 'delete from sp_goods_attr where goods_id = ?';
    database.driver.execQuery(sql, [goods_id], function(err) {
        if (err) return cb('根据ID删除商品参数错误');
        cb(null);
    });
}

/**
 * 根据ID查询参数列表
 * @param {*} goods_id 
 * @param {*} cb 
 */
module.exports.list = function(goods_id, cb) {
    db = databaseModule.getDatabase();
    sql = "SELECT good_attr.goods_id,good_attr.attr_id,good_attr.attr_value,good_attr.add_price,attr.attr_name,attr.attr_sel,attr.attr_write,attr.attr_vals FROM sp_goods_attr as good_attr LEFT JOIN sp_attribute as attr ON attr.attr_id = good_attr.attr_id WHERE good_attr.goods_id = ?";
    database.driver.execQuery(sql, [goods_id], function(err) {
        if (err) return cb('根据ID查询参数列表错误');
        cb(null);
    });
}