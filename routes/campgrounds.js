const express  = require("express");
const Campground = require("../models/campground");
const campground = require("../models/campground");
const router   = express.Router();
const middleware = require("../middleware");
//Index - show all components
router.get("/",(req, res)=>{
    //get all campground from db
    Campground.find({}, (err,allCampgrounds) =>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//create - add new campground to db
router.post("/", middleware.isLoggedIn ,(req, res)=>{
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name: name, image: image, description: description, author: author, price: price};
    //create a new campground and save to db
    Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success","Campground Added");
            res.redirect("/campgrounds");
        }
    })
});

//new - show form to create nwe campground
router.get("/new",middleware.isLoggedIn,(req, res)=>{
    res.render("campgrounds/new");
});

//show - shows more info about one campground
router.get("/:id", (req, res)=>{
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
        if(err){
            console.log(err);
        } else{
            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (!foundCampground) {
            return res.status(400).send("Item not found.")
        }
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});  

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership ,(req, res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, (err, updatedCampground)=>{
        if (!updatedCampground) {
            return res.status(400).send("Updated Campground not found.")
        }
        req.flash("success", "Campground updated");
        res.redirect("/campgrounds/" + req.params.id);
    });
});  

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            if (!campgroundRemoved) {
                return res.status(400).send("Item not found.")
            }
            req.flash("success","Campground deleted");
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;