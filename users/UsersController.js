const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: { email: email }
    }).then(user => {

        if (user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/login");
            }).catch((error) => {
                res.redirect("/");
            });
        } else {
            res.redirect("/admin/users/create");
        }
    })
})

router.get("/login", (req, res) => {
    res.render("admin/users/login");
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            //Validar senha
            var correctPassword = bcrypt.compareSync(password, user.password);

            if (correctPassword) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

router.get("/admin/users/edit", adminAuth, (req, res) => {
    var id = req.session.user.id;

    console.log("aqui " + id); 
    User.findByPk(id).then(user => {
        if (id != undefined) {
           
            res.render("admin/users/edit", {user: user})
        } else {
            res.redirect("/admin/articles")
        }
    }).catch(error => {
        res.redirect("/admin/articles");
    })
})

router.post("/users/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    console.log()

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);


    User.update(
        {email: email, password: hash}, {
            where: {
                id: id
            }
        }
    ).then(() => {
        res.redirect("/admin/articles");
    });
})

module.exports = router;
