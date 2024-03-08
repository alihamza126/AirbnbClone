const express = require('express');
const router = express.Router()
const passport = require('passport');
const { saveUrl } = require('../utils/middleware');


//controllors
const userControllors = require('../controllers/user');


//signup routes
router.route('/signup')
    .get(userControllors.signupForm)
    .post(saveUrl, userControllors.signupPut)

//login routes
router.route('/login')
    .get(userControllors.loginForm)
    .post(
        saveUrl,
        passport.authenticate('local',
            { failureRedirect: '/login', failureFlash: true }),
        userControllors.login
    )


//logout routes
router.get('/logout', userControllors.logout);


module.exports = router;