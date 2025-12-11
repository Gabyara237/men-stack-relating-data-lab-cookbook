const express = require("express");
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async(req,res)=> {
    try{
        const allRecipes = await Recipe.find({owner:req.session.user._id})
        res.locals.recipes = allRecipes;
        res.render('recipes/index.ejs');
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

router.get('/:recipeId',async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.params.recipeId);
        res.locals.recipe = recipe;
        res.render('recipes/show.ejs');

    }catch(error){
        console.log(error);
        res.redirect('/')
    }

})

router.delete('/:recipeId', async(req,res)=>{

    try{
        const recipe = await Recipe.findById(req.params.recipeId);
        
        if(recipe.owner.equals(req.session.user._id)){
            await Recipe.deleteOne({_id: recipe._id});
            return res.redirect('/recipes')
        }else{
            return res.redirect('/')
        }

    }catch(error){
        console.log(error)
        res.redirect('/')

    }
})


module.exports = router;