const express = require('express');
const router = express.Router();
const Seq = require('sequelize');
const Usuario = require('../models/usuarios');
const Playlist= require('../models/playlists');
const bcrypt = require('bcryptjs');
const { redirect } = require('express/lib/response');
const passport = require('passport');
const {eAdmin} = require("../helpers/eAdmin")
const {eUser} = require("../helpers/eUser")
const request = require('request');
const { user } = require('pg/lib/defaults');

router.get("/home", function(req, res) {
    res.render('ejs/home');
});

router.get("/home/sucessdelete", function(req, res) {
    req.flash("success_msg", "Sua conta foi excluida com sucesso!")
    res.redirect('/v1/home');
});

router.get("/", function(req, res) {
    res.render('ejs/home');
});


router.get('/ola/:nome', function(req,res) {
    res.send("Olá " + req.params.nome);
});

//Usuario endpoints:
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
                            res.redirect("/v1/login")
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
});

router.get("/login", async function(req, res) {
    res.render("ejs/login")
});

router.post("/login", function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/v1/home",
        successFlash: "Logando com sucesso!",
        failureRedirect: "/v1/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", function(req, res) {
    req.logout()
    req.flash('success_msg', "Deslogado com sucesso")
    res.redirect("/v1/home")
});

router.get('/conta/success', eUser, function(req,res) {
    req.flash("success_msg", "Sua senha foi alterada com successo!")
    res.redirect('/v1/conta');
})

router.get('/conta/fail', eUser, function(req,res) {
    req.flash("error_msg", "Erro ao executar operação!")
    res.redirect('/v1/conta');
})

router.get('/conta', eUser, function(req,res) {
    res.render("ejs/conta")
})

router.delete('/deletarconta', eUser, function(req,res) {
    try {
        Usuario.destroy({
            where: {
                id: req.user.id
            }
        })
        req.logout()
        res.redirect(303, '/v1/home')
    } catch (error) {
        console.log(error)
        res.redirect(400, '/v1/conta')
    }
})

router.put('/mudarsenha', eUser, function(req,res) {
    try {
        if(req.body.password.length < 8) {
            res.redirect(400, '/v1/conta')
        }
        else {
            userpassword = req.body.password
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(userpassword, salt, (erro, hash) => {
                    if(erro) {
                        throw Error("Erro ao criar hash na mudança de senha!");
                    }
                    newpassword = hash

                    Usuario.update({password: newpassword}, {where: {id: req.user.id}})

                    res.redirect(303, '/v1/conta')
                })
            });
        }
    } catch(error) {
        console.log(error)
        res.redirect(400, '/v1/conta')
    }
})
//--------------



//Playlists endpoints:
router.get('/cadastroplaylist', eUser, function(req, res) {
    res.render("ejs/cadastroPlaylist")
});

router.post("/cadastrarplaylist", eUser, function(req, res) {
    if(typeof(req.body.playlistGroup) == 'undefined') {
        req.flash("error_msg", "Selecione uma playlist para inserir!")
        res.redirect("/v1/cadastroplaylist")
        return;
    } else if(Array.isArray(req.body.playlistGroup)) {
        req.body.playlistGroup.forEach(function saveplaylists(data) {
            playlist = data.split(",");
            var novaPlaylist = Playlist.build({
                appid: playlist[0],
                totaltracks: playlist[2],
                collaborative: playlist[5],
                name: playlist[4],
                owner: playlist[3],
                insertedby: req.user.id,
                imageURL: playlist[1],
                appname: playlist[6]
            });
            novaPlaylist.save()
        })
        req.flash('success_msg', "Playlists inseridas com successo!")
    }
    else {
        playlist = req.body.playlistGroup.split(",");
        var novaPlaylist = Playlist.build({
            appid: playlist[0],
            totaltracks: playlist[2],
            name: playlist[4],
            collaborative: playlist[5],
            owner: playlist[3],
            insertedby: req.user.id,
            imageURL: playlist[1],
            appname: playlist[6]
        });
        novaPlaylist.save()
        req.flash('success_msg', "Playlist inserida com successo!")
    }
    res.redirect("/v1/home")
})

router.get("/playlists", async function(req, res) {
    try {
        playlists = await Playlist.findAll({
            attributes: ['imageURL','name', 'totaltracks', 'owner', 'collaborative', 'appname', 'appid'],
            raw: true
        })
        res.json(playlists)
    } catch(err) {
        console.log(err)
    }
});

router.get("/playlists/:userid", async function(req, res) {
    userid = req.params.userid;
    try {
        playlists = await Playlist.findAll({
            attributes: ['imageURL', 'name', 'totaltracks', 'owner', 'collaborative', 'appname'],
            where: {insertedby: userid},
            include: [{
                model: Usuario,
                required: true
            }]
        })
        res.json(playlists)
    } catch(err) {
        console.log(err)
    }
});
// --------------------

//Spotify:
var client_id = 'c27e1388febe44de99321b4672071d83'; // Your client id
var client_secret = 'b2daef0f590f4abcbf817efdc1739786'; // Your secret
var redirect_uri = 'http://localhost:8081/v1/cadastroPlaylist'; // Your redirect uri

router.get('/spotifyplaylists/:userid', function(req, res) {
    userid=req.params.userid;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
    };
      
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var token = body.access_token;
            var playlistOptions = {
                url: 'https://api.spotify.com/v1/users/'+userid+'/playlists',
                headers: {
                  'Authorization': 'Bearer ' + token
                }
            };
            request.get(playlistOptions, function(error, response, body) {
                if(!error && response.statusCode === 200) {
                    res.json(body)
                }
                else {
                    res.json()
                    console.log(response.statusCode)
                }
            })

        } else {
            console.log("Erro nas credenciais do spotify")
        }
    });
});

//--------------------------------------------------

module.exports = router;