var path = require('path');
var daoModule = require('./DAO');
var databaseModel = require(path.join(process.cwd(), "modules/database"));

/**
 * 获取权限列表:左侧菜单权限
 * @param {*} cb 
 */
module.exports.list = function (cb) {
    db = databaseModel.getDatabase();
    sql = "select * from sp_permission_api as api left join sp_permission as main on main.ps_id = api.ps_id where main.ps_id is not null";
    database.driver.execQuery(sql, function (err, result) {
        if (err) return cb("获取权限列表失败", null);
        cd(null, result);
    });
}

/**
 * 权限验证
 * @param {*} rid 
 * @param {*} serviceName 
 * @param {*} actionName 
 * @param {*} cb 
 */
module.exports.authRight = function (rid, serviceName, actionName, cb) {
    if (rid == 0) return cb(null, true);
    daoModule.selectOne("PermissionAPIModel", {
        "ps_api_service": serviceName,
        "ps_api_action": actionName
    }, function(err, permissionAPI){
        console.log("rid => %s,serviceName => %s,actionName => %s",rid,serviceName,actionName);
        if(err || !permissionAPI) return cb("无权限访问", false);
        daoModule.selectOne("RoleModel", {"role_id":rid}, function(err,role){
            console.log(role);
            if(err || !role) return cb("获取权限信息失败",false);
            ps_ids = role.ps_ids.split(",");
            for(idx in ps_ids){
                ps_id = ps_ids[idx];
                if(parseInt(permissionAPI.ps_id) == parseInt(ps_id)){
                    return cb(null, true);
                }
            }
            return cb("无访问权限", false);
        });
    });
}