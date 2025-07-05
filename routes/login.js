const express=require('express');
const router=express.Router();
const User=require('../models/User')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')


const SECRET='summarysecret'

router.post('/signup', async (req,res)=>{
    const {email,password}=req.body;

    const exists=await User.findOne({email});
    
    if(exists){
        return res.status(400).json({message:"User already exists"})

    }

    const bcrypted= await bcrypt.hash(password,10)
    const newUser= new User({email,password:bcrypted})
    await newUser.save();
    res.status(201).json({message:'user created successfulyy'}

    )
})

router.post('/loggingin',async (req,res)=>{
    const {email,password}=req.body

    const user=await User.findOne({email})
    
    if (!user){
        return res.status(401).json({message:'invalid email'})
    }

    const pwd =await bcrypt.compare(password,user.password);

    if(!pwd){
        return res.status(401).json({message:'Invalid password'})

    }

    const token=jwt.sign({email:user.email},SECRET,{expiresIn:'30m'})
    res.json({token});


})

module.exports=router;