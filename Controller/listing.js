const mongoose = require("mongoose");
const Listing= require("../models/listing.js");

//Index Route
module.exports.indexRoute=async (req,res) =>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}

//New Route
module.exports.newRoute=(req,res) =>{
    res.render("listings/new.ejs")
 }
 
//Show Route
module.exports.showRoute= async (req, res) => {
    const { id }= req.params;
    const trimmedId = id.trim();
     const objectId =new mongoose.Types.ObjectId(trimmedId);
    const listing= await Listing.findById(objectId).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are searching for does not exist!");
        return res.redirect("/listings");
    }
     res.render("listings/show.ejs", {listing});
 }

 //Create Route
 module.exports.createRoute=async(req,res,next) =>{   
    let url= req.file.path;
    let filename= req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image= {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

//Edit Route
module.exports.editRoute = async (req,res) =>{
    const { id }= req.params;
   const trimmedId = id.trim();
    const objectId =new mongoose.Types.ObjectId(trimmedId);
   const listing= await Listing.findById(objectId);
   if(!listing){
       req.flash("error","Listing you are searching for does not exist!");
       return res.redirect("/listings");
   }

   let originalUrl=listing.image.url;
   let originalUrlImage=originalUrl.replace("/upload","/upload/w_250");
   res.render("listings/edit.ejs",{listing,originalUrlImage});
}

//Update Route
module.exports.updateRoute= async (req,res) =>{
    const { id }= req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename= req.file.filename;
        listing.image={url,filename};
        await listing.save();
}
     
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//Delete Route
module.exports.deleteRoute=async (req,res) =>{
    const { id }= req.params;
    const trimmedId = id.trim();
    const objectId =new mongoose.Types.ObjectId(trimmedId);
    let deletedList= await Listing.findByIdAndDelete(objectId);
    console.log(deletedList);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");    
}