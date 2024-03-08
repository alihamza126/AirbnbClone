const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userModel=require('./models/userModel.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');

if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}
const PORT = process.env.PORT || 5000;


// authenticate
const passport=require('passport')
const LocalStrategy=require('passport-local')
const passportMongoose=require("passport-local-mongoose")

//routers
const listningRouter = require('./routes/listning.js')
const reviewRouter = require('./routes/review.js'); 
const userRouter = require('./routes/user.js'); 
const { indexListning } = require('./controllers/listning.js');

const sessionOption = {
    secret: 'AliHamza',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() +24 * 60 * 60 * 1000,
        maxAge: 24 * 60 * 60 * 1000
    }
}

app.use(cookieParser("AliHamza"))
app.use(expressSession(sessionOption));
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate())); 
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser())

// database connection
const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB).then(() => {
            console.log('its okkkk')
        });
    } catch (error) {
        console.log(error)
    }
}
main();

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs', ejsmate);
app.use(express.json())

//Locals data added
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser =req.user;
    next();
})

//routers
app.use('/listning', listningRouter);
app.use('/listning/:id/review', reviewRouter); 
app.use('/',userRouter); 


//api for all get listening
app.get('/', indexListning)


//page not found err route
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'page not found'))
})


// ----------------------------------error Handling Middle-Ware--------------------------------
app.use((err, req, res, next) => {
    const { status = 500, message = "error is occour", name } = err;
    res.render('listning/error.ejs', { message })
})
const validationError = (err) => {
    console.log("validation error is occour please follow these rules of set");
    return err;
}


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });