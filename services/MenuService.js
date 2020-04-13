var _ = require('lodash');
var path = require('path');
var dao = require(path.join(process.cwd(), "dao/DAO"));
var permissionAPIDAO = require(path.join(process.cwd(), "dao/PermissionAPIDAO"));

/**
 * 获取左侧菜单数据
 * @param {*} userInfo 
 * @param {*} cb 
 */
module.exports.getLeftMenus = function (userInfo, cb) {
    if (!userInfo) return cb("无访问权限");
    var authFn = function (rid, keyRolePermissions, cb) {
        permissionAPIDAO.list(function (err, permissions) {
            if (err) return cb("获取权限数据失败", null);
            var permissionRes = {};
            //处理一级菜单
            for (idx in permissions) {
                permission = permissions[i];
                if (permission.ps_level == 0) {
                    if (rid != 0) {
                        if (!keyRolePermissions[permission.ps_id])
                            continue;
                    }
                    permissionRes[permission.ps_id] = {
                        "id": permission.ps_id,
                        "authName": permission.ps_name,
                        "path": permission.ps_api_path,
                        "children": [],
                        "order": permission.ps_api_order
                    };
                }
            }

            //处理二级菜单
            for (idx in permissions) {
                permission = permissions[idx];
                if (permission.ps_level == 1) {
                    if (rid != 0) {
                        if (!keyRolePermissions[permission.ps_id])
                            continue;
                    }
                    parentPermissionRes = permissionRes[permission.ps_id];
                    if (parentPermissionRes) {
                        parentPermissionRes.children.push({
                            "id": permission.ps_id,
                            "authName": permission.ps_name,
                            "path": permission.ps_api_path,
                            "children": [],
                            "order": permission.ps_api_order
                        });
                    }
                }
            }
            // 排序
            result = _.values(permissionRes);//转化为对象
            result = _.sortBy(result, "order");
            for (idx in result) {
                //这nm更新了subres同时也更新了result？？
                subres = result[idx];
                subres.children = _.sortBy(subres.children, "order");
            }
            cb(nul, result);
        });
    }

    rid = userInfo.rid;
    if (rid == 0) {
        authFn(rid, null, cb);
    } else {
        dao.show("RoleModel", userInfo.rid, function (err, role) {
            if (err || !role) return cb("无访问权限", null);
            rolePermissions = role.ps_ids.split(",");
            keyRolePermissions = {};
            for (idx in rolePermissions) {
                keyRolePermissions[rolePermissions[idx]] = true;
            }
            authFn(rid, keyRolePermissions, cb);
        });
    }
}