const listeningModels = require('../models/listening/listningModel');
const reviewModel = require('../models/listening/reviewModel');
const { joiReviewchema, joiListningschema } = require('./joiValidation');


module.exports.isLoggedIn = (req, res, next) => {
        if (!req.isAuthenticated()) {
                req.flash('error', "please login first");
                req.session.redirectUrl = req.originalUrl;
                return res.redirect('/login')
        }
        next();
}

// ---------------url save-----
module.exports.saveUrl = (req, res, next) => {
        if (req.session.redirectUrl) {
                res.locals.redirectUrl = req.session.redirectUrl || "/";
                return next()
        }
        res.locals.redirectUrl = req.session.redirectUrl || "/";
        next()
}

// --------------- listning validation -----
module.exports.listningValidation = (req, res, next) => {
        const { error } = joiListningschema.validate(req.body);
        if (error) {
                const msg = error.details.map((e) => e.message).join(",")
                req.flash('error', msg)
                res.redirect('/listning/new')
        }
        else {
                next()
        }
}

// --------------- Reviewchema validation -----
module.exports.validateReview = (req, res, next) => {
        const { error } = joiReviewchema.validate(req.body);
        if (error) {
                const msg = error.details.map((e) => e.message).join(",")
                throw new ExpressError(400, msg)
        } else {
                next()
        }
}

// ---------------listnig owner validation -----
module.exports.isOwner = async (req, res, next) => {
        const id = req.params.id;
        const listningTemp = await listeningModels.findById(id);
        if (listningTemp.owner.equals(res.locals.currUser._id)) {
                return next()
        }
        else {
                req.flash('error', "you don't have permission")
                res.redirect('/')
        }
}

// ---------------listnig Review owner validation -----
module.exports.isReviewOwner = async (req, res, next) => {
        const { id, reviewid } = req.params;
        const reviewData = await reviewModel.findById(reviewid);
        if (!res.locals.currUser._id.equals(reviewData.owner)) {
                req.flash('error', "You don't have permissions !");
                return res.redirect(`/listning/${id}`)
        }
        next()
}