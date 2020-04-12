module.exports = function (db, cb) {
    //用户模型
    db.define("RoleModel", {
        role_id: { type: 'serial', key: true },
        role_name: String,
        ps_ids: String,
        ps_ca: String,
        role_desc: String
    },{
        tabel: "sp_role"
    });
    return cb();
}