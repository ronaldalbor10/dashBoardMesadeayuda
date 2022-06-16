const jwt = require('jsonwebtoken');
const config = require('../config/jwtSecret');

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token){
        /*
        return res.status(401).json({
            auth:false, 
            message: 'Acceso denegado'
        });
        */
       return res.redirect('/login');
    }

    jwt.verify(token, config.secret, (err, decode)=>{
        if(err){
            console.log(err);
            //return res.status(404).json('Token invalido');
            return res.redirect('/login');
        }else{
            console.log(decode);
            req.userID = decode.id
            next();
        }
    });
}

module.exports = verifyToken;