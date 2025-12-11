const express = require("express")
const router = express.Router();

const User = require('../models/user.js');
router.get('/', async (req,res)=>{
    const allUsers = await User.find({});
    console.log(allUsers);
    res.render("users/index.ejs",{allUsers});
})

router.get('/:userId', async (req,res)=>{

    const userProfile = await User.findById(req.params.userId)
    res.render("users/show.ejs",{userProfile:userProfile})
})

module.exports = router;