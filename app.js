const express = require("express");

const app = express();
const port = 8081

app.use(express.static('./public'));
app.set('view engine', 'ejs');


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

app.get("/", function(req, res) {
    res.render('ejs/index');
});



app.get('/ola/:nome', function(req,res) {
    res.send("Olá " + req.params.nome);
});





app.listen(port, function() {
    console.log("servidor rodando na url http://localhost:"+port);
});