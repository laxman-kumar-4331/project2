const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const mongoose = require("mongoose");

// //post review
 module.exports.postReview=async(req,res) =>{
    const { id }= req.params;
    const trimmedId = id.trim();
    const objectId =new mongoose.Types.ObjectId(trimmedId);
    const listing= await Listing.findById(objectId);
    const newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
 res.redirect(`/listings/${listing._id}`);
}

//delete review
module.exports.deleteReview=async(req,res) =>{
    let {id,reviewId} =req.params;
    const trimmedId = id.trim();
    const objectId =new mongoose.Types.ObjectId(trimmedId);
    await Listing.findByIdAndUpdate(objectId, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

}