const express=require('express');
const app=express();
const mongoose=require('mongoose');
const listening=require('../listningModel');
const dummydata=require('./dummy');

const models=require('../index');

const main=async()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/wonderlust").then(()=>{
        console.log('its okkkk')
    })
}
main();



app.get('/',async(req,res)=>{
        // await listening.deleteMany({});
        // listening.find().then((res)=>{
        //     console.log(res)
        // }).catch((err)=>{
        //         console.log(err)
        // })
        await models.listningModel.deleteMany({});
        const data=dummydata.data.map((res)=>({...res,owner:"65be09174f94bb7fd0bbfc57"}))
        console.log(data)
        await models.listningModel.insertMany(data).then((res)=>{
            console.log("okk updated is okk")
        }).catch((err)=>{
            console.log(err)
        })

})

app.listen(4000)