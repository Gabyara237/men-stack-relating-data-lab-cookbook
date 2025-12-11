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
    const ingredients = await Ingredient.find({});
    res.render('recipes/new.ejs',{ingredients});
})

router.post('/',async(req,res)=>{
    try{
        const selectIngredients = req.body.selectedIngredients;
        const newIngredients = req.body.newIngredients;

        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id;

        const ingredientSet = new Set();
        
        let selected;
        if (selectIngredients) {
            selected = selectIngredients;
        } else {
            selected = [];
        }

        if (!Array.isArray(selected)) {
            selected = [selected];
        }

        if(selected.length>0){
            selected.forEach((ingredient_id)=>{
                if(!ingredientSet.has(ingredient_id)){
                    newRecipe.ingredients.push(ingredient_id);
                    ingredientSet.add(ingredient_id);
                }
            })
        }

        if(newIngredients && newIngredients.trim()!== ""){
            const addedIngredients = newIngredients.split(',').map(ingredient=>ingredient.trim()).filter(ingredient => ingredient !=="");

            for(const ingredient of addedIngredients){
                const normalizedIngredient = ingredient.toLowerCase();

                let ingredientToAdd = await Ingredient.findOne({name:normalizedIngredient});

                if(!ingredientToAdd){
                    ingredientToAdd = await Ingredient.create({name:normalizedIngredient});
                }

                const ingredientIdString = ingredientToAdd._id.toString();
                if(!ingredientSet.has(ingredientIdString)){
                    newRecipe.ingredients.push(ingredientToAdd._id);
                    ingredientSet.add(ingredientIdString);
                }
            }
        }

        await newRecipe.save();

        res.redirect("/recipes");

    }catch (error){
        console.log(error);
        res.redirect("/")
    }

})

router.get('/:recipeId',async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
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


router.get('/:recipeId/edit', async (req,res)=>{

    try{
        const recipe = await Recipe.findById(req.params.recipeId);

        if(recipe.owner.equals(req.session.user._id)){

            return res.render('recipes/edit.ejs',{recipe});
        }else{
            return res.redirect('/');
        }
    }catch (error){
        console.log(error);
        res.redirect('/')
    }
})

router.put('/:recipeId', async (req,res) =>{
    try{
        const recipe = await Recipe.findById(req.params.recipeId);

        if(recipe.owner.equals(req.session.user._id)){
           
            recipe.set(req.body)
            await recipe.save();
            return res.redirect(`/recipes/${recipe._id}`);

        }else{
            res.redirect('/')
        }
        
    }catch (error) {
        console.log(error);
        res.redirect('/')
    }
})


module.exports = router;