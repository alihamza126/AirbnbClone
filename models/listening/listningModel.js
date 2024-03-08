const mongoose = require('mongoose');
const reviewModel = require('./reviewModel');
const fs = require('fs')

const listenSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,

    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listenSchema.post('findOneAndDelete', async (res) => {
    await reviewModel.deleteMany({ _id: { $in: res.reviews } });
})
// listenSchema.post("findOneAndUpdate",async(res)=>{
//     if(fs.existsSync(res.image.url)){
//         await fs.unlinkSync(res.image.url)
//     }
//     else{
//         console.log('image not found')
//         console.log(res.image.url)
//     }
// })


const listening = mongoose.model('listning', listenSchema);

module.exports = listening;