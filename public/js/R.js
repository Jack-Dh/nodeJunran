/**
 *
 * 查询
* **/
const mysql=require('mysql')
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'nodejs',
})

connection.connect();//连接数据库

connection.query('select * from user',(err,results,fields)=>{
        if (err){
            throw err
        }
        console.log('查询成功',results)
})
connection.end()