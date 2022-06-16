const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');
const helpers = require('./lib/helpers');
const { database } = require('./config/keys');

const app = express();
require('./lib/passport');

//Configuraciones

//configuracion del puerto del servidor express
app.set("port",process.env.PORT || 3037);
app.set('trust proxy', true);
app.set("views",path.join(__dirname, "views"));


var hbs = exphbs.create({defaultLayout: 'main',
                         extname:'.hbs',
                         helpers:require("./lib/helpers"),
                         layoutsDir:path.join(app.get("views"),'layouts'),
                         partialsDir: path.join(app.get("views"),'partials'),
});                      

app.engine('hbs', hbs.engine);
app.set('view engine','.hbs');

//Midelwares
app.use(session({
    secret: 'OsticketByRac',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database),
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales

app.use((req, res, next)=>{
    app.locals.success = req.flash("success");
    app.locals.message = req.flash("message");
    app.locals.user = req.user;
    next();
});

//Rutas

app.use(require("./routes/"));
app.use(require("./routes/auth"));
app.use('/ajax',require("./routes/ajax"));

//Archivos Publicos
app.use('/modules',express.static(path.join(__dirname,'../node_modules')));
app.use(express.static(path.join(__dirname,'./public')));
/*
app.use(function (req, res) {
    res.status(404).render('404');
});
*/
 
app.listen(app.get("port"), ()=>{
    console.log("Servidor ejucutando en puerto", app.get("port"), helpers.dateForLog());    
});
