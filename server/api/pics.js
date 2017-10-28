import {Router} from 'express'
const multer = require('multer');
const bytes = require('bytes');
const qn = require('qn');
const fs = require('fs');


const router = Router()
let bucket = 'ntboao'


// 配置multer
// 详情请见https://github.com/expressjs/multer
let createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

let uploadFolder = './tmp/my-uploads';

createFolder(uploadFolder);

// 通过 filename 属性定制
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({storage: storage})


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


router.post('/pics/upload', upload.single('file'), function (req, res, next) {
    let file = req.file;
    let dirname = req.body.dirname
    console.log('dirname: %s', dirname)
    let filename = file.originalname

    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);

    client.uploadFile(file.path, {key: `/${dirname}/${filename}`}, function (err, result) {
        if (err) {
            console.log('上传失败')
            console.log(err)
        } else {
            let store_url = result.url;
            console.log('result: %s', store_url)
            // 上传之后删除本地文件
            fs.unlinkSync(file.path);
        }

    });
    res.send({ret_code: '0'});
});

export default router
