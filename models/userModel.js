const mongoose=require('mongoose')
const schema=mongoose.Schema;
const passportMongoose=require('passport-local-mongoose');

const userSchema=new schema({
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(passportMongoose)
const userModel=mongoose.model('user',userSchema);

module.exports=userModel;