const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match:[
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
        ]
    },
    password:{
        type:String,
        required:true,
    }
});

module.exports=mongoose.model('User',userSchema);