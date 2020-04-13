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
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function (fieldName, file, fileName, encoding, mimeType) {
            var fileExtArray = fileName.split(".");
            var ext = fileExtArray[fileExtArray.length - 1];
            var saveFileName = uniqid() + "." + ext;
            var savePath = path.join(process.cwd(), upload_config.get("upload_ueditor"), saveFileName);
            file.on('end', function () {
                var result = {
                    'url': upload_config.get("baseURL") + "/" + upload_config.get("upload_ueditor") + "/" + saveFileName,
                    'title': req.body && req.body.picTitle || fileName,
                    'original': fileName,
                    'state': 'SUCCESS'
                };
                if (req.query.encode) {
                    res.jsonp(result);
                } else {
                    res.redirect(upload_config.get("simple_upload_redirect") + "?result=" + JSON.stringify(result));
                }
            });
            file.pipe(fs.createWriteStream(savePath));
        });
        req.pipe(busboy);
    } else if (req.query.action === 'listimage') {
        fs.readdir(path.join(process.cwd(), upload_config.get("upload_ueditor")), function (err, files) {
            if (err) return res.end();
            var total = files.length;
            var fileList = [];
            var total = 0;
            _(files).forEach(function (file) {
                var fileExtArray = file.split(".");
                var ext = fileExtArray[fileExtArray.length - 1];
                if (fileType.indexOf(ext.toLowerCase()) >= 0) {
                    var resultFile = {};
                    resultFile.url = upload_config.get("baseURL") + "/" + upload_config.get("upload_ueditor") + "/" + file;
                    fileList.push(resultFile);
                    total++;
                }
            });
            res.jsonp({
                "state": "SUCCESS",
                "list": fileList,
                "start":1,
                "total": total
            });
        });
    }
}