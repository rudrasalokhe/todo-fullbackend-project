const jwt = require('jsonwebtoken');
const { ModifiedPathsSnapshot } = require('mongoose');
const JWT_SECRET = "ilovetanvi";
function auth(req, res, next)  {
    const token = req.headers.token;
    const response = jwt.verify(token,JWT_SECRET);
    if(response){
        req.userId = response.indexOf;
        next();
    }
    else{
        res.status(303).json({
            message : "incorrect credentials"
        })
    }
}
module.exports({
    auth, 
    JWT_SECRET
})