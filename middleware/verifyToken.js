const jwt=require('jsonwebtoken')

const SECRET='summarysecret';


function verifyToken(req,res,next){
    const header=req.headers.authorization;

    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message:`no token provided`})
        
    }

    const token=header.split(' ')[1];
    try{
        const decoded=jwt.verify(token,SECRET)

        req.user=decoded
        next()
    }
    catch(err){
        console.log(err)
    }
}

module.exports=verifyToken