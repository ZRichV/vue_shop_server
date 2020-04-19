var _ = require('lodash');
var path = require('path');
var dao = require(path.join(process.cwd(), "dao/DAO"));
var permissionAPIDAO = require(path.join(process.cwd(), "dao/PermissionAPIDAO"));

/**
 * 权限验证函数
 * @param {*} rid 
 * @param {*} serviceName 
 * @param {*} actionName 
 * @param {*} cb 
 */
module.exports.authRight = function (rid, serviceName, actionName, cb) {
    permissionAPIDAO.authRight(rid, serviceName, actionName, function (err, pass) {
        cb(err, pass);
    });
}

/**
 * 
 * @param {*} permissionKeys 
 * @param {*} permissionIds 
 */
function getPermissionsRes(permissionKeys, permissionIds) {
    var permissionsRes = {};
    //处理一级菜单
    for (idx in permissionIds) {
        if (!permissionIds[idx] || permissionIds[idx] == "") continue;
        permissionId = parseInt(permissionIds[idx]);
        permission = permissionKeys[permissionId];
        if (permission && permission.ps_level == 0) {
            permissionsRes[permission.ps_id] = {
                "id": permission.ps_id,
                "authName": permission.ps_name,
                "path": permission.ps_api_path,
                "children": []
            };
        }
    }
    tmpRes = {};
    // 处理二级菜单
    for (idx in permissionIds) {
        if (!permissionIds[idx] || permissionIds[idx] == "") continue;
        permissionId = parseInt(permissionIds[idx]);
        permission = permissionKeys[permissionId];
        if (permission && permission.ps_level == 1) {
            parentPermissionRes = permissionsRes[permission.ps_pid];
            if (parentPermissionRes) {
                tmpRes[permission.ps_id] = {
                    "id": permission.ps_id,
                    "authName": permission.ps_name,
                    "path": permission.ps_api_path,
                    "children": []
                }
                parentPermissionRes.children.push(tmpRes[permission.ps_id]);
            };
        }
    }
    //处理三级菜单
    for (idx in permissionIds) {
        if (!permissionIds[idx] || permissionIds[idx] == "") continue;
        permissionId = parseInt(permissionIds[idx]);
        permission = permissionKeys[permissionId];
        if (permission && permission.ps_level == 2) {
            parentPermissionRes = tmpRes[permission.ps_pid];
            if (parentPermissionRes) {
                parentPermissionRes.children.push({
                    "id": permission.ps_id,
                    "authName": permission.ps_name,
                    "path": permission.ps_api_path
                });
            }
        }
    }
    return permissionsRes;
}

/**
 * 获取所有用户的角色/权限  
 * @param {*} cb 
 */
module.exports.getAllRoles = function (cb) {
    dao.list("RoleModel", null, function (err, roles) {
        if (err) return cb('获取角色数据失败');
        permissionAPIDAO.list(function (err, permissions) {
            if (err) return cb('获取权限数据失败');
            var permissionKeys = _.keyBy(permissions, 'ps_id');
            var rolesRes = [];
            for (idx in roles) {
                role = roles[idx];
                permissionIds = role.ps_ids.split(",");
                roleRes = {
                    "id": role.role_id,
                    "roleName": role.role_name,
                    "roleDesc": role.role_desc,
                    "children": []
                };
                roleRes.children = _.values(getPermissionsRes(permissionKeys, permissionIds));
                rolesRes.push(roleRes);
            }
            cb(null, rolesRes);
        });
    });
}

/**
 * 添加角色
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.createRole = function (params, cb) {
    if (!params.roleName) return cb('角色名称不能为空');
    if (!params.roleDesc) params.roleDesc = "";
    dao.create("RoleModel", {
        "role_name": params.roleName,
        "role_desc": params.roleDesc,
        "ps_ids": ""
    }, function (err, role) {
        if (err) return cb("创建角色失败");
        cb(null, {
            "roleId": role.role_id,
            "roleName": role.role_name,
            "roleDesc": role.role_desc
        });
    });
}

/**
 * 通过角色ID获取角色详情
 * @param {*} id 
 * @param {*} cb 
 */
module.exports.getRoleById = function (id, cb) {
    if (!id) return cb("角色ID不能为空");
    if (isNaN(parseInt(id))) return cb("角色ID必须为数字");
    dao.show('RoleModel', id, function (err, role) {
        if (err) return cb("获取角色详情失败");
        cb(null, {
            "roleId": role.role_id,
            "roleName": role.role_name,
            "roleDesc": role.role_desc,
            "rolePermissionDesc": role.ps_ca
        });
    });
}

/**
 * 更新角色信息
 * @param {*} params 
 * @param {*} cb 
 */
module.exports.updateRole = function (params, cb) {
    if (!params) return cb("参数不能为空");
    if (!params.id) return cb("角色ID不能为空");
    if (isNaN(parseInt(params.id))) return cb("角色ID必须是数字");
    updateInfo = {};
    if (params.roleName) {
        updateInfo["role_name"] = params.roleName;
    }
    if (params.roleDesc) {
        updateInfo["role_desc"] = params.roleDesc;
    }
    dao.update("RoleModel", params.id, updateInfo, function (err, newRole) {
        if (err) return cb("更新角色信息失败");
        cb(null, {
            "roleId": newRole.role_id,
            "roleName": newRole.role_name,
            "roleDesc": newRole.role_desc,
            "rolePermissionDesc": newRole.ps_ca
        });
    });
}

/**
 * 对角色进行授权
 * @param {*} rid 
 * @param {*} rights 
 * @param {*} cb 
 */
module.exports.updateRoleRight = function (rid, rights, cb) {
    if (!rid) return cb("角色ID不能为空");
    if (isNaN(parseInt(rid))) return cb("角色ID必须为数字");
    //需要更新权限描述信息字段
    dao.update("RoleModel", rid, { "ps_ids": rights }, function (err, newRole) {
        if (err) return cb("更新权限失败");
        cb(null, {
            "roleId": newRole.role_id,
            "roleName": newRole.role_name
        });
    });
}
/**
 * 删除权限
 * @param {*} rid 
 * @param {*} deletedRightId 
 * @param {*} cb 
 */
module.exports.deleteRoleRight = function (rid, deletedRightId, cb) {
    dao.selectOne("RoleModel", {
        "role_id": rid
    }, function (err, role) {
        if (err || !role) return cb("获取角色信息失败", false);
        ps_ids = role.ps_ids.split(",");
        new_ps_ids = [];
        for (idx in ps_ids) {
            ps_id = ps_ids[idx];
            if (parseInt(deletedRightId) == parseInt(ps_id)) {
                continue;
            }
            new_ps_ids.push(ps_id);
        }
        new_ps_ids_string = new_ps_ids.join(",");
        role.ps_ids = new_ps_ids_string;
        role.save(function (err, newRole) {
            if (err) return cb("删除权限失败");
            permissionAPIDAO.list(function (err, permissions) {
                if (err) return cb('获取权限数据失败');
                permissionIds = newRole.ps_ids.split(",");
                var permissionKeys = _.keyBy(permissions, 'ps_id');
                return cb(null, _.values(getPermissionsRes(permissionKeys, permissionIds)));
            });
        });
    });
}

/**
 * 删除角色
 * @param {*} ib 
 * @param {*} cb 
 */
module.exports.deleteRole = function (id, cb) {
    if (!id) return cb("角色ID不能为空");
    if (isNaN(parseInt(id))) return cb("角色ID必须为数字");
    dao.destroy("RoleModel", id, function (err) {
        if (err) return cb("删除失败");
        cb(null, true);
    })
}

