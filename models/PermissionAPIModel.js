module.exports = function(db,cb){
    //用户模型：权限验证
    db.define("PermissionAPIModel", {
        id:{type: 'serial', key: trur},
        ps_id: Number,
        ps_api_service: String,
        ps_api_action: String,
        ps_api_order: Number
    },{
        tabel:"sp_permission_api"
    });
    return cb();
}