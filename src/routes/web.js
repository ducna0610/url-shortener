import express from "express";
import HomeController from "../app/controllers/HomeController.js";
import AuthController from "../app/controllers/AuthController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import LinkController from "../app/controllers/LinkController.js";
import StoreLinkRequest from "../app/requests/Link/StoreLinkRequest.js";
import RegisterUserRequest from "../app/requests/User/RegisterUserRequest.js";
import LoginUserRequest from "../app/requests/User/LoginUserRequest.js";
import UpdateUserRequest from "../app/requests/User/UpdateUserRequest.js";

let router = express.Router();

export default {
    initWebRoute: (app) => {
        router.get("/test", async (req, res) => {
            res.json(1);
        });

        router.get("/forgot-password", AuthController.forgotPassword);

        router.get("/register", AuthController.register);

        router.post(
            "/register",
            RegisterUserRequest.rule,
            AuthController.processRegister
        );

        router.get("/login", AuthController.login);

        router.post(
            "/login",
            LoginUserRequest.rule,
            AuthController.processLogin
        );

        router.get("/:short", LinkController.redirect);

        // [Middleware]
        router.use(AuthMiddleware.isAuth);

        router.get("/", HomeController.index);

        router.get("/profile", AuthController.showProfile);

        router.post("/profile", UpdateUserRequest.rule, AuthController.updateProfile);

        router.get("/about", HomeController.about);

        router.get("/logout", AuthController.logout);

        // [Link]
        router.get("/link", LinkController.index);

        router.get("/link/detail/:id", LinkController.detail);

        router.post("/link", StoreLinkRequest.rule, LinkController.store);

        router.get("/link/edit/:id", LinkController.edit);

        router.post(
            "/link/edit/:id",
            StoreLinkRequest.rule,
            LinkController.update
        );

        router.post("/link/delete/:id", LinkController.delete);

        router.use(function (req, res) {
            res.render("pages/404", {
                title: "404",
                layout: "./layouts/empty",
            });
        });

        return app.use("/", router);
    },
};
