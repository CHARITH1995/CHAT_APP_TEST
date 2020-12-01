var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users');

router.post('/login', (req, res) => {
    usersController.userLogin(req).then(result => {
        res.status(200).send({ success: result.success, token: result.token});
    }).catch(err => {
        res.status(500).send(err);
    })
});

router.post('/register', (req, res) => {
    usersController.registerUser(req).then(result => {
        res.status(200).send({ success: result.success, token: result.token });
    }).catch(err => {
        res.status(500).send(err);
    })
});

router.get('/getAllUsers',(req,res)=>{
    usersController.getAllUsers(req).then(result =>{
        res.status(200).send(result)
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router;