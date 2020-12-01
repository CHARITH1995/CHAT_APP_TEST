const mysql = require('mysql');
const bcrypt = require('bcryptjs');

module.exports.generateHash = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10) );
};

module.exports.emailValidation = (email) => {
    var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
},'Invalid email';

module.exports.verifyPassword = (inputPassword, encryptedPassword) =>{
    return bcrypt.compareSync(inputPassword,encryptedPassword);
};