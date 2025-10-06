var express = require("express")
var router = express.Router()
const userModel = require("./users")
const postModel = require("./posts")
const passport = require("passport")
const upload = require("./multer")

const  localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate())) ;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" })
}) 

router.get("/login", function (req, res, next) {
  res.render("login",{ error: req.flash("error") })
})

router.get("/feed", async function (req, res, next) {
  try {
    // Fetch all posts from database (latest first)
    const posts = await postModel.find().populate("user").sort({ createdAt: -1 });
    res.render("feed", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading feed");
  }
});


router.post("/upload", isLoggedIn, upload.single("image"), async function (req, res, next) {
  if(!req.file){
    return res.status(404).send("No file were given.")
  }
  // which file upload is uploaded that save to database and that postid use and give the userid to the post
  const user = await userModel.findOne({ username: req.session.passport.user });

  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id,
  })
   user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

  // res.send("file uploaded successfully");
})

router.get("/profile", isLoggedIn, async function (req, res, next) {
    const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts");
   console.log(user) 
  res.render("profile", { user })
})

// router.get("/profile", isLoggedIn, async function (req, res) {
//   res.send("profile")
// })

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname })

  userModel.register(userData, req.body.password)
    .then(function () {
     passport.authenticate("local")(req, res, function () {
        res.redirect("profile")
      })
    })  
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}),
  function (req, res) {

})

router.get("/logout", function (req, res) {
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

 function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
     return next();
   }
   res.redirect('/login');
 }

module.exports = router
