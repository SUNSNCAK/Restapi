const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const saltRounds = 10;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rentgoods'
  });

app.get('/user', async (req, res) => {
  let sql = 'SELECT * FROM user'
  await conn.execute(sql, (err, result) => {
    if (err) {
        res.status(500).json({
            message : err.message
        })
        return
    }
    res.status(200).json({
        message : "เรียกข้อมูลสำเร็จ",
        data : result
    })
  })
})

app.post('/register', async (req, res) => {
    const { email , password , firstname , lastname , number } = req.body
    let role = 'member'
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, (err, hash) => {
            let sql = "INSERT INTO user (email, password, firstname, lastname, number, role) VALUES (?, ?, ?, ?, ?, ?)"
            conn.execute(sql, [email, hash, firstname, lastname, number, role], (err, result) => {
                if (err) {
                    res.status(500).json({
                        message : err.message
                    })
                    return
                }
                res.status(201).json({
                    message : "เพิ่มข้อมูลสำเร็จ",
                    data : result
                })
            })
        });
    });
})

app.put('/update/:user_id', async (req, res) => {
    const {user_id} = req.params
    const {email, password, firstname, lastname, number } = req.body
    bcrypt.genSalt(saltRounds , (err,salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            let sql = "UPDATE user SET email =?, password =?, firstname =?, lastname =?, number =? WHERE user_id =?"
            conn.execute(sql, [email, hash, firstname, lastname, number, user_id], (err, result) => {
                if (err) {
                    res.status(500).json({
                        message : err.message
                    })
                    return
                }
                res.status(201).json({
                    message : "แก้ไขข้อมูลสำเร็จ",
                    data : result
                })
            })
        })
    })
})

app.delete('/delete/:user_id', async (req, res) => {
    const {user_id} = req.params
    let sql = 'DELETE FROM user WHERE user_id =?'

    conn.execute(sql, [user_id], (err, result) => {
        if (err) {
            res.status(500).json({
                message : err.message
            })
            return
        }
        res.status(201).json({
            message : "ลบข้อมูลสำเร็จ",
            data : result
        })
    })
})

app.get('/user/:user_id', async (req, res) => {
    const {user_id} = req.params
    let sql = 'SELECT * FROM user WHERE user_id = ?'
    conn.execute(sql, [user_id], (err, result) => {
        if (err) {
            res.status(500).json({
                message : err.message
            })
            return
        }
        res.status(200).json({
            message : "เรียกข้อมูลสำเร็จ",
            data : result
        })
    })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})