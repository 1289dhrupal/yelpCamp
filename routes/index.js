const express  = require("express");
const router   = express.Router();
const passport = require("passport");
const User     = require("../models/user");


//root route
router.get("/",(req,res)=>{
    res.render("landing");
});

//show register form
router.get("/register", (req, res)=>{
    res.render("register",{page: 'register'});
});

//handle sign up logic
router.post("/register", (req, res)=>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success","Welcome to YelpCampv" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES
router.get("/login", (req, res)=>{
    res.render("login",{page: 'login'});
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome back to YelpCamp!!!",
    failureFlash: true
}),(req, res)=>{
});

//LOGOUT
router.get("/logout",(req, res)=>{
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/campgrounds");
});

module.exports = router;