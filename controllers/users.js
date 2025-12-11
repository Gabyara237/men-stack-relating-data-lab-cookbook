const express = require("express")
const router = express.Router();

const User = require('../models/user.js');
router.get('/', async (req,res)=>{
    const allUsers = await User.find({});
    console.log(allUsers);
    res.render("users/index.ejs",{allUsers});
})

module.exports = router;