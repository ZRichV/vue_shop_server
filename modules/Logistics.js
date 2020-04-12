const request = require('request');

// 自动匹配运单号所属的物流公司
function autoComNumber(orderno) {
    const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`;
    return new Promise(function (resolve, reject) {
        request(url, (err, respose, body) => {
            if (err) return reject({
                status: 500,
                msg: err.message
            });
            body = JSON.parse(body);
            if (body.auto.length <= 0) return reject({
                status: 501,
                msg: '无对应的物流公司'
            });
            resolve({
                status: 200,
                msg: body.auto[0],
                comCode: body.auto[0].comCode
            });
        })
    });
}

async function getLogisticsInfo(req, res) {
    const result = await autoComNumber(req.params.orderno);
    if (result.status !== 200) {
        return res.send({
            meta: {
                status: 500,
                message: '物流公司获取失败'
            }
        });
    }

    const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.orderno}&temp=0.2595247267684455`;
    request(dataUrl, (err, respose, bosy) => {
        if (err) {
            return res.send({
                meta: {
                    status: 501,
                    message: '物流信息获取失败'
                }
            });
        }
        return res.send({
            meta: {
                status: 200,
                message: '物流信息获取成功'
            },
            data: (JSON.parse(body)).data
        });
    })
}

module.exports = { getLogisticsInfo }