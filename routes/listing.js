const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExError= require("../utils/ExError.js");
const {listingSchema}=require("../joi");
const { isLoggedIn,isOwner } = require("../middleware.js");
const Controller= require("../Controller/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage });

const validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExError(400,result.error);
    }
    else{
        next();
    }
}

//Index Route
 
router.get("/",wrapAsync(Controller.indexRoute));

//New Route
router.get("/new",isLoggedIn,Controller.newRoute);

// Show Route
router.get("/:id", wrapAsync(Controller.showRoute));
 
 //Create Route
 router.post("/", isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(Controller.createRoute))

 //Edit Route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(Controller.editRoute));
 
 //Update Route
 router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(Controller.updateRoute));
 
 //Delete Route
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(Controller.deleteRoute));

 module.exports = router;