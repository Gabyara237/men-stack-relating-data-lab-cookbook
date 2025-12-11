const express = require("express");
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async(req,res)=> {
    try{
        const allRecipes = await Recipe.find({owner:req.session.user._id})
        res.render('recipes/index.ejs',{
            recipes: allRecipes,
        });
    }catch(error){
        console.log(error);
        res.redirect('/');
    }    
});


router.get('/new', async(req,res) =>{
    res.render('recipes/new.ejs');
})

router.post('/',async(req,res)=>{
    try{
        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id;
        await newRecipe.save();
        
        res.redirect("/recipes");

    }catch (error){
        console.log(error);
        res.redirect("/")
    }

})


module.exports = router;