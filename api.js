/* Este é o código inicial. dê "node app.js" em um terminal para começar a aplicação */

// Definição de variáveis e módulos necessários
const express = require('express');
const app = express();
const port = 8082;
const bodyParser = require('body-parser');
const api = require("./routes/api.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
require("./config/auth")(passport);
// const expressLayouts = require('express-ejs-layouts')

//Session:
app.use(session({
    secret: "adminadmin",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

//---------------------------------------------------------
//Middleware:
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
});

//Model Engine:
// app.use(express.static('./public'));
// app.use(expressLayouts)
app.set('view engine', 'ejs');

// Body Parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Verifica as tabelas do banco de dados, cria elas se não existirem.
(async () => {
    const Usuario = require('./models/usuarios.js');
    const Playlist = require('./models/playlists.js');
    try {
        await Usuario.sync();
        await Playlist.sync();
        console.log("Database Iniciada!");
    } catch (error) {
        console.log(error);
    }
})();
//-------------------------------------------------------------------

//Rotas:
app.use('/api', api);

app.get('/', function(req, res) {
    res.redirect("/api/home")
})


app.listen(port, function() {
    console.log("servidor rodando na url http://localhost:"+port);
});