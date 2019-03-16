/**
 * Контроллер авторизации
 */

const express = require("express");
const router = express.Router();
const User = require("../models/users/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Вход на сайт
router.post("/login", (req, res, next) => {
    const errors = {};

    // Находим пользователя по e-mail
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            // Если пользователь не найден, то ошибка в e-mail
            if (!user) {
                errors.email = "Пользователь с таким e-mail не найден";
                return res.status(422).json({ errors: errors });
            }

            // Проверяем пароль
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    // User Matched
                    const payload = {
                        id: user.id,
                        title: user.title,
                        avatar: user.avatar
                    }; // Create JWT Payload

                    // Sign Token
                    jwt.sign(
                        payload,
                        "Secret Key",
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    errors.password = "Неверный пароль";
                    return res.status(422).json({ errors: errors });
                }
            });
        })
        .catch(err => next(err));
});

//if (process.env.NODE_ENV === "dev") {
// В режиме разработки можно зарегистрироваться
router.post("/register", (req, res, next) => {
    errors = {};
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = "Пользователь с таким e-mail уже зарегистрирован";
            return res.status(422).json({ errors: errors });
        } else {
            const newUser = new User({
                title: req.body.title,
                email: req.body.email,
                password: req.body.password,
                group: req.body.group
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => next(err));
                });
            });
        }
    });
});
//}

module.exports = router;
