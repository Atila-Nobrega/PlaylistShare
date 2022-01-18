const express = require('express');
const app = express();
const port = 8081;
const bodyParser = require('body-parser');
const v1 = require("./routes/v1");
const session = require('express-session');
const flash = require('connect-flash');

//Session:
app.use(session({
    secret: "adminadmin",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
//Middleware:
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")

    next()
});

//Model Engine:
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// Body Parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Verifica as tabelas do banco de dados, cria elas se não existirem!
(async () => {
    const database = require('./models/db.js');
    const Produto = require('./models/usuarios.js');
 
    try {
        const resultado = await database.sync();
        console.log("Database Iniciada!");
    } catch (error) {
        console.log(error);
    }
})();
//-------------------------------------------------------------------


//Rotas:
app.use('/v1', v1);



app.listen(port, function() {
    console.log("servidor rodando na url http://localhost:"+port);
});