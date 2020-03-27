var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");




//COMMENT ROUTES
//NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundCampground});
		}	
});
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			Comment.create({text:req.body.text},function(err,comment){
				if(err){
					req.flash("error","Something went wrong!");
					console.log(err);
				}else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success","Successfully created comment!");
					res.redirect("/campgrounds/"+req.params.id);
				}
 			})
		}
	});
});

//EDIT FORM
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds/"+req.params.id);
		}
		
			Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err){
					console.log(err);
				}else{
			res.render("comments/edit",{comment:foundComment,campground_id:req.params.id});
				}
			});
});
	});
	

//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//DELETE ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","deleted comment!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
	
	
module.exports = router;