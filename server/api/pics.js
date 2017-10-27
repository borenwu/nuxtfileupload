import { Router } from 'express'
const multer = require('multer');
const bytes = require('bytes');
const qn = require('qn');

const router = Router()


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

/* GET users listing. */
router.post('/pics/upload', function (req, res, next) {
    // 上传单个文件
    // 这里`image`对应前端form中input的name值
    upload.single('file')(req, res, function(err) {
        if (err) {
            return console.error(err);
        }
        if (req.file && req.file.buffer) {
            // 上传到七牛
            // client.upload(req.file.buffer, {
            //     key: '/upload/' + new Date().getTime()
            // }, function(err, result) {
            //     if (err) {
            //         return res.json({
            //             code: 1,
            //             msg: '上传失败！',
            //             data: {
            //                 src: ''
            //             }
            //         });
            //     }
            //     res.json({
            //         code: 0,
            //         msg: '上传成功！',
            //         data: {
            //             src: result.url + '?imageslim'
            //         }
            //     });
            // });
            console.log(req.file)
            res.json({
                msg:"1"
            })
        }
    });

})



export default router
