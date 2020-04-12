//富文本编辑器
var _ = require('lodash');
var path = require('path');
var Busboy = require('busboy');
var fs = require('fs');
var uniqid = require('uniqid');
var ueditor_config = require(path.join(process.cwd(), "/config/ueditor.config.js"));
var upload_config = require('config').get("upload_config");

var fileType = 'jpg, png, gif, ico, bmp';
module.exports = function (req, res, next) {
    if (req.query.action == "config") {
        // 给客户端信息
        res.jsonp(ueditor_config);
    } else if (req.query.action ===
        'uploadimage' || req.query.action ===
        'uploadfile' || req.query.action ===
        'uploadvideo') {
            var busboy = new Busboy({ headers: req.headers});
            busboy.on('file', function(fieldName, file, fileName, encoding, mimeType){
                var fileExtArry = fileName.split(".");
                var ext = fileExtArry[fileExtArry.length - 1];
                var saveFileName = uniqid() + "." + ext;
                var savePath = path.join(process.cwd(), upload_config.get("upload_ueditor"), saveFileName);
                
            })
        }
}