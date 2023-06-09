import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import validate from "../utils/validate.js";
import mailer from "../utils/mailer.js";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import { promisify } from "util";
import fs from "fs";

const readFile = promisify(fs.readFile);
export default {
    register: (req, res) => {
        if (req.cookies.token) {
            return res.redirect("/");
        }

        let errors = req.session.errors;
        delete req.session.errors;

        res.render("auth/register", {
            title: "Register",
            errors: errors,
            layout: "./layouts/empty",
        });
    },
    processRegister: async (req, res) => {
        try {
            let isEmailExist = await User.findOne({ email: req.body.email });
            if (isEmailExist) {
                let errors = {
                    email: {
                        value: req.body.email,
                        msg: [`Email is existed!`],
                    },
                };

                req.session.errors = errors;
                return res.redirect("/register");
            }

            let errors = validate.getErrors(req);
            req.session.errors = errors;

            if (errors) {
                return res.redirect("/register");
            }

            const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

            const hash = bcrypt.hashSync(req.body.password, salt);

            const entity = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: 0,
            };

            let user = await User.create(entity);

            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

            const accessToken = await jwt.generateToken(
                user._id,
                accessTokenSecret,
                accessTokenLife
            );

            res.cookie("token", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 30 days
                httpOnly: true, // The cookie only accessible by the web
            });

            let html = await readFile("./src/views/mail/welcome.ejs", "utf8");
            let htmlContent = ejs.render(html, {
                APP_URL: process.env.APP_URL,
                username: user.name,
                password: req.body.password,
            });
            mailer.sendMail(user.email, "Register Success!", htmlContent);

            return res.redirect("/");
        } catch (e) {
            console.log(e);
        }
    },
    login: (req, res) => {
        if (req.cookies.token) {
            return res.redirect("/");
        }

        let errors = req.session.errors;
        delete req.session.errors;

        res.render("auth/login", {
            title: "Login",
            errors: errors,
            layout: "./layouts/empty",
        });
    },
    processLogin: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (user === null) {
                let errors = {
                    email: {
                        value: req.body.email,
                        msg: [`Email or password don't correct!`],
                    },
                };

                req.session.errors = errors;
                return res.redirect("/login");
            }

            const rs = bcrypt.compareSync(req.body.password, user.password);

            if (rs === false) {
                console.log(2);
                let errors = {
                    email: {
                        value: req.body.email,
                        msg: [`Email or password don't correct!`],
                    },
                };

                req.session.errors = errors;
                return res.redirect("/login");
            }

            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

            const accessToken = await jwt.generateToken(
                user._id,
                accessTokenSecret,
                accessTokenLife
            );

            res.cookie("token", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 30 days
                httpOnly: true, // The cookie only accessible by the web
            });

            return res.redirect("/");
        } catch (error) {
            // return res.status(500).json(error);
            return res.redirect("/login");
        }
    },
    showProfile: (req, res) => {
        try {
            let errors = req.session.errors;
            delete req.session.errors;

            let alert = req.session.alert;
            delete req.session.alert;

            res.render("auth/profile", {
                title: "Profile",
                user: req.user,
                alert: alert,
                errors: errors,
                layout: "./layouts/master",
            });
        } catch (e) {
            return res.redirect("/");
        }
    },
    updateProfile: async (req, res) => {
        try {
            let errors = validate.getErrors(req);
            req.session.errors = errors;

            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    name: req.body.name,
                },
                { new: true }
            );

            req.session.alert = "updated";

            return res.redirect("/profile");
        } catch (error) {
            return res.redirect("/");
        }
    },
    logout: (req, res) => {
        res.clearCookie("token");

        return res.redirect("/login");
    },
    forgotPassword: (req, res) => {
        let errors = req.session.errors;
        delete req.session.errors;

        res.render("auth/forgot_password", {
            title: "Reset password",
            errors: errors,
            layout: "./layouts/empty",
        });
    },
};
