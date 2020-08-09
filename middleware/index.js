const Campground = require("../models/campground"),
Comment          = require("../models/comment");

//ALL THE MIDDLEWARES

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
       
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                 //does the user own the campground
                 if (!foundCampground) {
                    req.flash("error", "Campground not found.");
                    return res.redirect("back");
                }
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                res.redirect("back");
            }else{
                if (!foundComment) {
                    req.flash("error", "Comment not found.");
                    return res.redirect("back");
                }
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged In!");
    res.redirect("/login");
}

module.exports = middlewareObj