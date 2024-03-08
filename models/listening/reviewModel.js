const mongoose=require('mongoose');
const {Schema}=mongoose;


const reviewSchema=Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});


const reviewModel=new mongoose.model('review',reviewSchema);

module.exports=reviewModel;