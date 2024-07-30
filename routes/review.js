const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const wrapAsync=require("../utils/wrapAsync.js");
const ExError= require("../utils/ExError.js");
const {listingSchema,reviewSchema}=require("../joi");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const { isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController= require("../Controller/review.js");


const validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExError(400,result.error);
    }
    else{
        next();
    }
}

//Post Route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.postReview));

//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
