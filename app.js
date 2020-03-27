var express               = require("express"),
    app                   = express(),
	bodyParser            = require("body-parser"),
	mongoose              = require("mongoose"),
	Campground            = require("./models/campground.js"),
	Comment               = require("./models/comment.js"),
	seedDB                = require("./seeds"),
	passport              = require("passport"),
	localStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User                  = require("./models/user"),
	methodOverride        = require("method-override"),
	flash                 = require("connect-flash");
	
//seedDB();

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");

mongoose.connect("mongodb+srv://Ayush-Gupta21:ayush@cluster0-0w3w5.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret:"ayush gupta",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("yelpcamp server has started !");
});
