const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner, listningValidation } = require('../utils/middleware.js');
const multer=require('multer');
const { storage } = require('../utils/cloudinary.js');
const upload=multer({storage,fileFilter:(req, file, cb)=>{
    if(file.mimetype=="image/jpg" ||file.mimetype=="image/png"||file.mimetype=="image/jpeg"){
       cb(null,true)
    }
    else{
        req.flash('error','Select valid image')
        cb(new Error('Select valid image!'));

    }
}})
// const upload=multer({dest:'uploads/'})

// ---------------listning controllers-----
const listningControllers = require('../controllers/listning.js');




// this is for new add post
router.get('/new', isLoggedIn, listningControllers.listnigNewFrom);


// for new put request
router.put('/new', isLoggedIn, upload.single('listning[image]'),listningValidation, listningControllers.putNewlistning)


// this api for get single post from list 
router.get('/:id', listningControllers.singleListinig)


// this is for add edit data in page
router.get('/:id/edit', isLoggedIn, isOwner, listningControllers.editListningForm)


// this is for add put edit data in page
router.put('/:id/edit', isLoggedIn, isOwner, upload.single('listning[image]'), listningValidation, listningControllers.editListingPut)


// Delete listning from listnings
router.delete('/:id', isLoggedIn, isOwner, listningControllers.destroyListning);


module.exports = router;