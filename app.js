if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const mongoStore=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const {isLoggedIn} = require("./middleware.js");
const ExError= require("./utils/ExError.js");

//Router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");


many().then(() =>{
    console.log("connection successful");
}).catch(err =>{
    console.log(err);
});
async function many(){
    //await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
     await mongoose.connect(process.env.ATLASDB_URL);
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=mongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("err",err);
})
const sessionOptions={
     store,
    secret:process.env.SECRET,
    // secret:"mycode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires : Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge : 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

//Using passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUsr = req.user;
    next();
})

//Routers
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews)
app.use("/",user);

app.all("*",(req,res,next) =>{
      next(new ExError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("listings/err.ejs",{message});
})

app.get("/", (req,res) =>{
    res.send("successfully working");
})

app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).send(message);
});

app.listen(3000, ()=>{
    console.log("app is listening to port 3000");
})