const wrapAsync = require("../utils/wrapAsync");
const listeningModels = require('../models/listening/listningModel');
const fs = require('fs');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding-v6');
const token = process.env.MAP_KEY;
const geocodingClient = mbxGeocoding({ accessToken: token });



// index listning 
module.exports.indexListning = async (req, res) => {
    try {
        const data = await listeningModels.find({});
        if (!data) {
            req.flash('error', "server down try again");
        }
        res.render('listning/index.ejs', { data });
    } catch (error) {
        req.flash('error', error.message)
        next()
    }
}
// listnig new form
module.exports.listnigNewFrom = async (req, res) => {
    return res.render('listning/new.ejs');
};

// listnig new form PUT
module.exports.putNewlistning = wrapAsync(async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const data = req.body.listning;
    const s1 = new listeningModels(data);

    const currentUser = res.locals.currUser;//it's form current user mean its owner
    s1.owner = currentUser; //then it's the owner field
    s1.image = { url, filename }; //save link of image save in cloud
    // -----------------------for geoCoding------------------------------
    let response =await geocodingClient.forwardGeocode({
        query:data.location,
        limit: 1
    }).send()
    s1.geometry=response.body.features[0].geometry;
    await s1.save();
    req.flash('success', 'Listning is added');
    res.redirect('/')
});

// single listning 
module.exports.singleListinig = wrapAsync(async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await listeningModels.findById(id).populate(
            {
                path: "reviews",
                populate: { path: "owner" }
            })
            .populate('owner');
        if (data) {
            res.render("listning/show.ejs", { data });
        }
    } catch (error) {
        req.flash('error', 'page is not found');
        next();
    }
});

module.exports.editListningForm = wrapAsync(async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await listeningModels.findById(id);
        if (!data) {
            req.flash('error', "this edit page is not found");
        } else {
            let imageUrl = data.image.url;
            imageUrl = imageUrl.replace('upload/', 'upload/w_200/');
            res.render("listning/edit.ejs", { data, imageUrl })
        }
    } catch (error) {
        req.flash('error', "this edit page is not found");
        next()
    }
})

module.exports.editListingPut = wrapAsync(async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        const id = req.params.id;
        const data = await listeningModels.findByIdAndUpdate(id, { ...req.body.listning });
        if (req.file) {
            data.image = { url, filename };
            data.save()
        }
        req.flash('success', 'Listning is update');
        res.redirect('/')
    } catch (error) {
        req.flash('error', "this edit page is not found")
        next()
    }
})


module.exports.destroyListning = wrapAsync(async (req, res) => {
    try {
        const id = req.params.id;
        await listeningModels.findByIdAndDelete(id);
        req.flash('success', 'Listning is deleted');
        res.redirect('/')
    } catch (error) {
        req.flash('success', "page is already deleted");
        next()
    }
})