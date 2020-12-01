const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../config/connection/connection');
const validations = require('../config/validations/validation');
require('dotenv').config();


exports.userLogin = (req) => {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM users WHERE email= ' + mysql.escape(req.body.userName);
        con.query(sql, (err, result, fields) => {
            if (err) return reject(err)
            if (result.length == 0) {
                return resolve({ message: 'not a valid user' });
            } else {
                //console.log(JSON.stringify(result))
                var userPassword = result[0].password;
                if (validations.verifyPassword(req.body.password, userPassword)) {
                    let token = jwt.sign(JSON.stringify(result[0]), process.env.SECRETKEY);
                    return resolve({ success: true, token: token })
                } else {
                    return reject(err)
                }
            }
        })
    })
}

exports.registerUser = (req) => {
    return new Promise((resolve, reject) => {
        let hashedPassword = validations.generateHash(req.body.password);
        let email = validations.emailValidation(req.body.email);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        }
        if (!email) {
            reject('email is already taken')
        } else {
            var sql = "INSERT INTO users (firstName , lastName , email , password ) VALUES ('" +
                req.body.firstName +
                "','" +
                req.body.lastName +
                "','" +
                req.body.email +
                "','" +
                hashedPassword +
                "')";

            con.query(sql, (error, result, fields) => {
                if (error) return reject(error)
                let token = jwt.sign(JSON.stringify(user), process.env.SECRETKEY);
                return resolve({ success: true, token: token })
            })
        }
    })
}


exports.getAllUsers = (req) =>{
   return new Promise((resolve , reject)=>{
        let sql = "select firstName , lastName , email from users";
        con.query(sql,(error , result , fields)=>{
            if(!error){
                resolve(result);
            }else{
                reject(error)
            }
        })
    })
}