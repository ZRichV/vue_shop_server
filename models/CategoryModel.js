module.exports = function(db, cb){
    db.define("CategoryModel", {
        cat_id: { type: 'serial', key: true },
        cat_name: String,
        cat_pid: Number,
        cat_level: Number,
        cat_deleted: Boolean
    }, {
        table: 'sp_category'
    });
    return cb();
}