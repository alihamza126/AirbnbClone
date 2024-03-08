const wrapAsync = require("../utils/wrapAsync");
const listeningModels=require('../models/listening/listningModel');
const reviewModel = require("../models/listening/reviewModel");

//for review post
module.exports.reviewPost=wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listning = await listeningModels.findById(id);
    const review = new reviewModel(req.body.review);
    review.owner=res.locals.currUser._id;
    await review.save();
    await listning.reviews.push(review);
    await listning.save()
    req.flash('success','Review is added');
    res.redirect(`/listning/${id}`)
})

//for review delete
module.exports.deleteReview=wrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params;
    await listeningModels.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await reviewModel.findByIdAndDelete(reviewid)
    req.flash('success','Review is Deleted');
    res.redirect(`/listning/${id}`)
})