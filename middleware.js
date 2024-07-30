const Listing= require("./models/listing.js");
const mongoose = require("mongoose");
const Review=require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");

// LogIn
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
   next();
}

//Owner

module.exports.isOwner=async(req,res,next) =>{
    let {id} =req.params;
    const trimmedId = id.trim();
    const objectId =new mongoose.Types.ObjectId(trimmedId);
    const listing= await Listing.findById(objectId);
    if(!listing.owner._id.equals(res.locals.currUsr._id)){
        req.flash("error","You are not the Owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Review Author

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const trimmedId = id.trim();
    const objectId = new mongoose.Types.ObjectId(trimmedId);
    
    // Fetch the listing and review
    const listing = await Listing.findById(objectId);
    const review = await Review.findById(reviewId);

    // Check if the review exists and if the current user is the author
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    // Proceed to the next middleware if the user is the author
    next();
});

