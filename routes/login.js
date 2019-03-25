let express = require('express')
let router = express.Router()
const mysql = require('mysql')
// let bodyParser=require('body-parser')

// router.use(bodyParser.json());

function select(key) {
    var p = new Promise(function (resolve, reject) {
        console.log('查询成功')
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
router.post('/', ((req, res) => {
    console.log(req.body)
    console.log(req.body.username)
    // return res.status(200).json({code: 1, message: '用户不存在'})
    select(req.body).then(data => {
        if (data.length != 0) {
            return res.status(200).json({code: 1, message: '查询成功！', data: [data]})
        } else {
            return res.status(200).json({code: 1, message: '用户不存在'})
        }
    })
    // const connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '123456',
    //     database: 'nodejs',
    // })
    // connection.connect();//连接数据库
    // connection.query(`select * from user where username='${req.body.username}' `, (err, results, fields) => {
    //     if (err) {
    //         throw err
    //     }
    //     console.log('查询成功', results)
    //     if (results.length != 0) {
    //         return res.status(200).json({code: 1, message: '查询成功！', data: [results]})
    //     } else {
    //         return res.status(200).json({code: 1, message: '用户不存在'})
    //     }
    // })
    // connection.end()
}))

/**
 *
 *
 * 添加
 * **/
router.post('/add', ((req, res) => {
    console.log(req.body)
    console.log(req.body.username)
    // return res.status(200).json({code: 1, message: '用户不存在'})

    //
    select().then(data => {
        //先查询数据库信息，再添加进数据库
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'nodejs',
        })

        let truefalse = data.map(item => {
            return item.username == req.body.username
        })
        let a = truefalse.indexOf(true)//判断是否包含
        if (a != '-1') {
            return res.status(200).json({code: 1, message: '姓名重复！'})
        } else {
            connection.connect();//连接数据库
            connection.query(`insert into user values('${data.length + 1}','${req.body.username}','${req.body.password}')`, (err, results) => {
                // '3','${req.body.username}','${req.body.password}
                if (err) {
                    throw err
                }
                if (results) {
                    return res.status(200).json({code: 1, message: '添加成功！'})
                } else {
                    return res.status(200).json({code: 1, message: '添加失败'})
                }
            })
            connection.end()
        }


    })


}))


module.exports = router;