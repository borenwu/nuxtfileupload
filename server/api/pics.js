import { Router } from 'express'
const multer = require('multer');
const bytes = require('bytes');
const qn = require('qn');

const router = Router()
let bucket = 'ntboao'

// 配置multer
// 详情请见https://github.com/expressjs/multer
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: bytes('10MB') // 限制文件在10MB以内
    },
    fileFilter: function(req, files, callback) {
        // 只允许上传jpg|png|jpeg|gif格式的文件
        var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|';
        var fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
        callback(null, !!fileTypeValid);
    }
});

// 七牛云配置
const client = qn.create({
// 秘钥在控制模板->个人中心->密钥管理中可以看到
    accessKey: 'rsnQ1mPiWJwthOmbSSIfwvsKkNX0ZzTrISaLMlM0',
    secretKey: 'Gu00U4X8-KUgHIAybg4TeeZnhjRX5d7-Dn8Jo89M',
// 空间名
    bucket: bucket,
// 这个是你要生成的前缀（你的外链地址，可以在空间中查看）
// 其实写不写都行，不写后面也得写.
    origin: 'http://oy98650kl.bkt.clouddn.com'
})


/* upload to qn */
router.post('/pics/upload', function (req, res, next) {
    // 上传单个文件
    // 这里`image`对应前端form中input的name值
    upload.single('file')(req, res, function(err) {
        if (err) {
            return console.error(err);
        }
        if (req.file && req.file.buffer) {
            // 上传到七牛
            let dirname = req.body.dirname
            let filename = req.body.filename
            console.log(req.file.buffer)

            client.uploadFile(req.file.buffer.toString(), {key: `/${dirname}/${filename}`}, function (err, result) {
                if (err) {
                    console.log('上传失败')
                    console.log(err)
                } else {
                    let store_url = result.url;
                    console.log('result: %s',store_url)
                }
                // 上传之后删除本地文件
                //fs.unlinkSync(filePath);
            });

            res.json({
                msg:"1"
            })
        }
    });

})



export default router
