const express = require("express")
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require("../models/recipe");
router.get('/', async (req,res)=>{
    const allUsers = await User.find({});
    res.render("users/index.ejs",{allUsers});
})

router.get('/:userId', async (req,res)=>{

    const userProfile = await User.findById(req.params.userId)
    const userRecipes = await Recipe.find({owner:req.params.userId})
    res.render("users/show.ejs",{userProfile:userProfile, userRecipes:userRecipes})
})

module.exports = router;