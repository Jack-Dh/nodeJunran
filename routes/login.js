let express = require('express')
let router = express.Router()
const mysql = require('mysql')
const utility = require('utility')
const sd = require('silly-datetime')

// let bodyParser=require('body-parser')
//
// router.use(bodyParser.json());

const multer = require('multer')
const fs = require('fs');
const pathLib = require('path');
//设置文件上传路径
var upload = multer({dest: 'D:/phpStudy/WWW/Image'});


// 单图上传
router.post('/upload', upload.single('logo'), function (req, res, next) {
    var newName = req.file.path + pathLib.parse(req.file.originalname).ext;
    fs.rename(req.file.path, newName, function (err) {
        if (err) {
            // filename
            return res.status(200).json({code: 1, message: '添加失败！'})
        } else {
            let imgMint=req.file.originalname.substr(req.file.originalname.indexOf('.'))
            console.log(imgMint)
            return res.status(200).json({code: 1, message: '添加成功！',url:`http://192.168.1.179:/Image/${req.file.filename}${imgMint}`})
        }
        res.end();
    })
    console.log(req.file)

});


function select(key) {
    var p = new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'nodejs',
        })
        connection.connect();//连接数据库
        if (key) {
            connection.query(`select * from user where username='${key.username}' and password='${key.password}'`, (err, results, fields) => {
                resolve(results)
                connection.end()
            })
        }
        // else {
        //     resolve('')
        //     // connection.query(`select * from user`, (err, results, fields) => {
        //     //     resolve(results)
        //     //     connection.end()
        //     // })
        // }


    })
    return p

}

/**
 * 查询
 * **/
router.get('/query', ((req, res) => {
    console.log('分页查询')
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'nodejs',
    })

    let pageSize = req.query.pageSize
    let pageNum = (Number(req.query.pageNum) - 1) * pageSize  //查询页数（偏移量）
    console.log(req.query)
    console.log(pageNum)
    let num
    //查询总数量
    connection.query(`SELECT SQL_CALC_FOUND_ROWS * from user`, (err, results, fields) => {
        num = results.length
        connection.end()
    })
    connection.query(`SELECT * from user limit ${pageNum},${pageSize}`, (err, results, fields) => {
        return res.status(200).json({code: 1, message: 'ojbk', data: {count: num, dataList: results}})
        connection.end()
    })
    // connection.query(`SELECT SQL_CALC_FOUND_ROWS * from user limit 0,10`, (err, results, fields) => {
    //     return res.status(200).json({code: 1,torlent:results.length,aaa:fields,message: results})
    //     connection.end()
    // })


}))
/**
 * 登录
 * **/
router.post('/login', ((req, res) => {
    console.log('66')

    console.log(req.body)
    select(req.body).then(data => {
        if (data.length != 0) {
            return res.status(200).json({
                code: 1, message: '登录成功！',
                data: {
                    username: req.body.username,
                    password: req.body.password,
                    token: utility.md5(req.body.username + req.body.password)
                }
            })
        } else {
            return res.status(200).json({code: 1, message: '用户不存在'})
        }
    })
    console.log('请求来了')


}))

/**
 *
 *
 * 添加
 * **/

router.post('/add', ((req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'nodejs',
        useConnectionPooling: true

    })
    console.log(req.body)
    let time = sd.format(new Date(), "YYMDHms")
    console.log(time)
    connection.connect();//连接数据库
    connection.query(`insert into user values('${time}','${req.body.username}','${utility.md5(req.body.password)}')`, (err, results) => {
        // '3','${req.body.username}','${req.body.password}
        if (err) {
            return res.status(200).json({code: 1, message: `添加失败${err}`})
            throw err

        }
        if (results) {
            return res.status(200).json({code: 1, message: '添加成功！'})
        } else {
            return res.status(200).json({code: 1, message: '添加失败'})
        }
    })
    connection.end()


    // connection.query(`insert into user values('101','${req.body.username}','${req.body.password}')`, (err, results) => {
    //     // '3','${req.body.username}','${req.body.password}
    //     if (err) {
    //         throw err
    //     }
    //     if (results) {
    //         return res.status(200).json({code: 1, message: '添加成功！'})
    //     } else {
    //         return res.status(200).json({code: 1, message: '添加失败'})
    //     }
    // })
    // connection.end()


    // select().then(data => {
    //     //先查询数据库信息，再添加进数据库
    //
    //     let truefalse = data.map(item => {
    //         return item.username == req.body.username
    //     })
    //     let a = truefalse.indexOf(true)//判断是否包含
    //     if (a != '-1') {
    //         return res.status(200).json({code: 1, message: '姓名重复！'})
    //     } else {
    //         connection.connect();//连接数据库
    //         connection.query(`insert into user values('${data.length + 1}','${req.body.username}','${req.body.password}')`, (err, results) => {
    //             // '3','${req.body.username}','${req.body.password}
    //             if (err) {
    //                 throw err
    //             }
    //             if (results) {
    //                 return res.status(200).json({code: 1, message: '添加成功！'})
    //             } else {
    //                 return res.status(200).json({code: 1, message: '添加失败'})
    //             }
    //         })
    //         connection.end()
    //     }


    // })


}))


/**
 *
 * 修改
 * **/
router.post('/updata', ((req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'nodejs',
    })
    let pass = req.body.password
    let ID = req.body.userID

    if (pass && ID) {
        connection.connect();//链接数据库
        connection.query(`UPDATE user SET password=${req.body.password} where userID=${req.body.userID}`, (error, result) => {
            if (error) {
                return res.status(200).json({code: 500, message: `${error}`})
            } else if (result) {
                if (result.changedRows == 1) {
                    return res.status(200).json({code: 200, message: '修改成功', data: result})
                } else {
                    return res.status(200).json({code: 200, message: '修改失败'})
                }
            } else {
                return res.status(200).json({code: 500, message: `网络错误`})
            }

        })

        connection.end()
    } else {
        return res.status(200).json({code: 500, message: `参数不全`})
    }


}))

/***
 * 删除
 * **/
router.post('/delete', ((req, res) => {
    // DELETE FROM user WHERE userID in ("2","3");
    //

    let id = req.body.ids
    let ids = eval(id) //将字符串类型转换为数组
    let parameters = ''

    ids.forEach(item => {
        parameters += `${item},`
    })
    parameters = parameters.substring(0, parameters.length - 1);//截取指定字符串

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'nodejs'
    })
    connection.connect(),//连接数据库
        connection.query(`delete from user where userID in(${parameters})`, (error, result) => {
            if (error) {
                return res.status(200).json({code: 500, message: `${error}`})
            } else if (result) {
                if (result.affectedRows != 0) {
                    return res.status(200).json({code: 200, message: `成功删除${result.affectedRows}条记录`, data: result})
                } else {
                    return res.status(200).json({code: 200, message: '删除失败'})
                }

            }
        })


}))

module.exports = router;