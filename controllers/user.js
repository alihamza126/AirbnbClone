const userModel = require("../models/userModel");
const wrapAsync = require("../utils/wrapAsync");

// signup Form
module.exports.signupForm=async (req, res, next) => {
    res.render('user/signup.ejs');
}

// signup put
module.exports.signupPut=wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body.data;
        const user = new userModel({
            username,
            email
        })
        const regUser = await userModel.register(user, password);
        req.login(regUser,(err)=>{
            if(err){
               return res.redirect('/login');
            }
            req.flash('success', "welcome to wonderLust");
            res.redirect(res.locals.redirectUrl)
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup')
    }
})


// login form
module.exports.loginForm=(req,res)=>{
    res.render('user/login.ejs')
}

//login put 
module.exports.login=async (req,res) => {
    req.flash('success',"welcome to wonderlust");
    res.redirect(res.locals.redirectUrl)
}

//logout

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        res.redirect('/');
    });
}