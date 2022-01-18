const express = require('express');
const router = express.Router();
const Seq = require('sequelize');
const Usuario = require('../models/usuarios');

router.get("/", function(req, res) {
    res.render('ejs/index');
});


router.get('/ola/:nome', function(req,res) {
    res.send("Olá " + req.params.nome);
});

//Usuario funções:
router.get("/cadastro", function(req, res) {
    res.render("ejs/cadastro")
});

router.post('/cadastro', function(req, res) {
    var erros = []

    if(!req.body.username) {
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.password) {
        erros.push({texto: "senha inválido"})
    }

    if(erros.length > 0) {
        
        res.render("ejs/cadastro", {erros: erros})
    }else {
        req.flash("success_msg", "Cadastro com sucesso!")
        res.redirect("cadastro")
    }

    //username, email, nome, password, passwordconfirm

});


//--------------
router.get('/teste', function(req, res) {
    res.render("ejs/teste");
})

module.exports = router;