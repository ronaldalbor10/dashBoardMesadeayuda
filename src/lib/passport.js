const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/conexiondb');
const helpers = require('./helpers')


passport.use('local.login',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async (req, username, password, done )=>{
    
    const users = await pool.query('SELECT * FROM ost_staff  WHERE username = ? or email = ?',[username, username]);
    console.log(users);
    if(users.length > 0){
        user = users[0];
        const validPassword = await helpers.matchPassword(password, user.passwd);
        if(validPassword){
            return done(null,user);   
        }else{
            return done(null,false,req.flash('message','Contraseña incorrecta'));
        }
    }else{
        return done(null, false,req.flash('message','El usuario no existe'));
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.staff_id);
});

passport.deserializeUser(async (id, done)=>{
    const rows = await pool.query(`SELECT * FROM ost_staff WHERE staff_id = ?`,[id]);
    done(null, rows[0]);
});