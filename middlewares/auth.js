const jwt = require('jsonwebtoken');
const connection = require('../DB/database');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    // console.log(req.body);
    if(!token) {
        return res.status(401).json({error: {type: 'jwt', msg: 'THERE IS NO TOKEN!'}});
    }else {
        connection.query('SELECT * FROM expired_tokens WHERE token = ?', token, (tokenError, tokenRes) => {
           if(tokenError) {
               res.status(500).json({error: {type: 'jwt', msg: 'SOMETHING WENT IN THE SERVER'}});
           }else if(tokenRes.length > 0) {
               res.status(401).json({error: {type: 'jwt', msg: 'THIS TOKEN IS EXPIRED MANUALLY!'}});
           }else {
               try {
                   jwt.verify(token, jwtSecretKey, (err, decoded) => {
                       if(err) {
                           console.log(err);
                       }

                       req.user = decoded.user.id;
                       next();
                   });
               }catch (e) {
                   res.status(401).json({error: {type: 'jwt', msg: 'THIS TOKEN IS EXPIRED!'}});
               }
            }
        });
    }
};