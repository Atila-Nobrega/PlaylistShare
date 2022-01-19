const express = require('express');
const router = express.Router();
const Seq = require('sequelize');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const { redirect } = require('express/lib/response');

router.get("/home", function(req, res) {
    res.render('ejs/home');
});

router.get("/", function(req, res) {
    res.render('ejs/home');
});


router.get('/ola/:nome', function(req,res) {
    res.send("Olá " + req.params.nome);
});

//Usuario funções:
router.get("/cadastro", function(req, res) {
    res.render("ejs/cadastro")
});

function validateEmail(email) 
    {
        return email.match(
/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    }

router.post('/cadastro', async function(req, res) {
    var erros = []

    if(!req.body.username || req.body.username.length>=20 || req.body.username.length<5) {
        erros.push({texto: "Usuario inválido"})
    }

    if(!req.body.email || !validateEmail(req.body.email)) {
        erros.push({texto: "Email inválido"})
    }
    
    if(!req.body.nome || req.body.nome.length>=100) {
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.password || req.body.password.length>=20 || req.body.password.length<8) {
        erros.push({texto: "Senha inválida"})
    } else if (req.body.passwordconfirm != req.body.password) {
        erros.push({texto: "Senhas são diferentes, tente novamente"})
    }

    if(erros.length > 0) {
        res.render("ejs/cadastro", {erros: erros})
    }else {
        Usuario.findOne({where: {email: req.body.email}}).then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Erro: Esse email já existe!")
                res.redirect("/v1/cadastro")
            }else {
                var novoUsuario = Usuario.build({
                    username: req.body.username,
                    email: req.body.email,
                    nome: req.body.nome,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro ao salvar o usuário, Erro no hash")
                            res.redirect("/v1/cadastro");
                        }
                        novoUsuario.password = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario Cadastrado com sucesso")
                            res.redirect("/v1/home")
                        }).catch((erro) => {
                            console.log(erro)
                            req.flash("error_msg", "Houve um erro ao salvar o usuário, erro no registro do DB")
                            res.redirect("/v1/cadastro");
                        });
                    })
                });
            }
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno com a database")
            res.redirect("/v1/cadastro")
        });

    }

    //username, email, nome, password, passwordconfirm

});


//--------------
router.get('/teste', function(req, res) {
    res.render("ejs/teste");
})

module.exports = router;