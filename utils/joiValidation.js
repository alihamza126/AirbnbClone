const joi = require('joi');

module.exports.joiListningschema = joi.object({
    listning: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().min(0).required(),
        description: joi.string().required(),
    })
})

module.exports.joiReviewchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required(),
    })
})

// module.exports.joiUserSignupSchema=joi.object({
//     data:joi.object({
//         username:joi.string().required(),
//         email:joi.string().email().required(),
//         password:joi.string().required()
//     })
// })