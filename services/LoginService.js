var path = require('path');
var Password = require('node-php-password');
var managerDAO = require(path.join(process.cwd(), "dao/ManagerDAO"));
var logger = require('../modules/logger').logger();

/**
 * 管理员登录
 * @param {[type]} username 
 * @param {[type]} password 
 * @param {Function} cb 
 */
module.exports.login = function (username, password, cb) {
    logger.debug('login => username:%s, password:%s', username, password);
    logger.debug(username);
    managerDAO.selectOne({ "mg_name": username }, function (err, manager) {
        logger.debug(err);
        if (err || !manager) return cb("用户名不存在");
        if (manager.role_id < 0) {
            return cb("该用户没有登录权限");
        }
        if (manager.role_id != 0 && manager.mg_state != 1) {
            return cb("该用户已经被禁用");
        }
        if (Password.verify(password, manager.mg_pwd)) {
            cb(null,
                {
                    "id": manager.mg_id,
                    "rid": manager.role_id,
                    "username": manager.mg_name,
                    "mobile": manager.mg_mobile,
                    "email": manager.mg_email,
                });
        } else {
            return cb("密码错误");
        }
    });
}