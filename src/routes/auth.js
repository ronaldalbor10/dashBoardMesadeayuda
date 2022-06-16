const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn,noNeedSeeIfyouLogIn } = require('../lib/auth');
const pool = require('../config/conexiondb');
const helpers = require('../lib/helpers');



router.get("/login",noNeedSeeIfyouLogIn,async(req, res)=>{
        res.render("auth/login" ,{layout: 'mainLog'});
});

router.post('/login',noNeedSeeIfyouLogIn, (req, res, next) => {
    passport.authenticate('local.login',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout',isLoggedIn, async(req, res) => {
    user = req.user;
       
    
    req.logOut();
    res.redirect('/');
});


module.exports = router;