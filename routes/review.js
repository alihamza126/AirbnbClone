const express = require('express');
const router=express.Router({mergeParams:true});
const { isLoggedIn,validateReview, isReviewOwner } = require('../utils/middleware.js');


//review controllors
const reviewControllors=require('../controllers/review.js');


// --------for review post-----------
router.post('/',isLoggedIn,validateReview,reviewControllors.reviewPost)

// --------for delete review post-----------
router.delete('/:reviewid',isLoggedIn,isReviewOwner,reviewControllors.deleteReview)




module.exports=router;