const connection = require('../../DB/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecretKey = process.env.JWT_SECRET;

module.exports = (app) => {
    app.post('/login', (req, res) => {
       const {email, password} = req.body;
       connection.query('SELECT * FROM users WHERE email = ? ', email, async (findUserError, findUserRes) => {
          if(findUserError) {
              res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG THE SQL DB!'}});
          } else if(findUserRes.length === 0) {
              res.status(401).json({error: {type: 'email', msg: 'THERE\'S NO USER WITH THAT EMAIL!'}});
          }else {
              const isPasswordMatch = await bcrypt.compare(password, findUserRes[0].password);
              if(!isPasswordMatch) {
                  res.status(400).json({error: {type: 'password', msg: 'WRONG PASSWORD!'}});
              }else {
                  const payload = {
                      user: {
                          id: findUserRes[0].id
                      }
                  }

                  jwt.sign(
                      payload,
                      jwtSecretKey,
                      {
                          expiresIn: '3500000'
                      },
                      (jwtError, token) => {
                          if(jwtError) {

                              res.json({token: token});
                              // res.status(500).json({error: {type: 'jwt', msg: 'JWT ERROR!'}});
                          }else {
                              res.json({token});
                          }
                      }
                  )
              }
          }
       });
    });
}