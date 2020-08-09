const express  = require("express");
const router   = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//NEW COMMENT
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//POST COMMENT
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //look up campground using ID
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            //create new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                } else {
                    //addusername and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    console.log(comment);
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                     //redirect campground show page
                     req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id,(err, foundComment)=>{
        if(err){
            res.render("back");
        }else{
            if (!foundComment) {
                return res.status(400).send("Comment not found.")
            }
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        } 
    });
});

//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back");
        } else {
            if (!updatedComment) {
                return res.status(400).send("Comment not found.")
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            if (!deletedComment) {
                return res.status(400).send("Comment not found.")
            }
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
    
module.exports = router;