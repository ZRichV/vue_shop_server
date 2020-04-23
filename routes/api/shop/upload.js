var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require('fs');
var multer = require('multer');
// 临时上传目录
var upload = multer({ dest: 'tmp_uploads/' });
var upload_config = require('config').get("upload_config");

router.post("/", upload.single('file'), function(req, res, next) {
    var fileExtArry = req.file.originalname.split('.');
    var ext = fileExtArry[fileExtArry.length - 1];
    var targetPath = req.file.path + '.' + ext;
    fs.rename(path.join(process.cwd(), "/" + req.file.path), path.join(process.cwd(), targetPath), function(err) {
        if (err) {
            return res.sendResult(null, 400, "上传文件失败");
        }
        res.sendResult({ "tmp_path": targetPath, "url": upload_config.get("baseURL") + "/" + targetPath }, 200, "上传失败");
    })
});

module.exports = router;