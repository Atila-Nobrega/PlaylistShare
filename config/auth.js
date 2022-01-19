const localStrategy = require("passport-local").Strategy
const Seq = require('sequelize');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'username', passwordField: 'password'}, (username, password, done) =>{
        Usuario.findOne({where: {username: username}}).then((usuario) => {
            if(!usuario) {
                return done(null, false, {message: "essa conta não existe"})
            }

            bcrypt.compare(password, usuario.password, (erro, igual) => {
                if(igual) {
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findByPk(id).then((usuario) => {
            done(null, usuario.id)
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro com o login")
            res.redirect("/v1/cadastro")
        });
    })
}