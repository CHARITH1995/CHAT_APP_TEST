const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers.authorization;
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.SECRETKEY,
            (err, decoded) => {
                if (err)
                    return res.status(500).send('Token authentication failed.');
                else {
                    req.body['decode'] = decoded;
                    next();
                }
            }
        )
    }
}