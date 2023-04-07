import validateHelper from "../helpers/validate.helper.js";
import Link from "../models/Link.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export default {
    index: async (req, res) => {
        try {
            let errors = req.session.errors;
            delete req.session.errors;

            let alert = req.session.alert;
            delete req.session.alert;

            let page = +req.query.page || 1;

            const LIMIT = 4;

            const pages = Math.ceil(
                (await Link.find({ user_id: req.user._id }).count()) / LIMIT
            );

            const RANGE = 4;

            let start = Math.round(page - RANGE / 2);
            let end = Math.round(page + RANGE / 2);

            if (start < 2) start = 2;
            if (end >= pages) end = pages - 1;

            let links = await Link.find({ user_id: req.user._id })
                .sort({ createdAt: -1 })
                .limit(LIMIT)
                .skip((page - 1) * LIMIT);

            res.render("link/index", {
                title: "Links",
                errors: errors,
                alert: alert,
                user: req.user,
                links: links,
                page: page,
                pages: pages,
                range: RANGE,
                start: start,
                end: end,
                layout: "./layouts/master",
            });
        } catch (e) {
            // console.log(e);
            return res.redirect("/");
        }
    },
    detail: async (req, res) => {
        try {
            let errors = req.session.errors;
            delete req.session.errors;

            let link = await Link.findOne({ _id: req.params.id });

            let url = new URL(link.full);
            
            if(link == null) {
                return res.redirect('/');
            }

            res.render("link/detail", {
                title: "Links",
                errors: errors,
                user: req.user,
                link: link,
                url: url,
                layout: "./layouts/master",
            });
        } catch (e) {
            // console.log(e);
            return res.redirect("/");
        }
    },
    edit: async (req, res) => {
        try {
            let errors = req.session.errors;
            delete req.session.errors;

            let link = await Link.findOne({ _id: req.params.id });

            res.render("link/edit", {
                title: "Links",
                errors: errors,
                user: req.user,
                link: link,
                layout: "./layouts/master",
            });
        } catch (e) {
            return res.redirect("/");
        }
    },
    update: async (req, res) => {
        try {
            let errors = validateHelper.getErrors(req);
            req.session.errors = errors;

            let page = req.query.page || 1;

            if (errors) {
                return res.redirect("back");
            }

            const link = await Link.findOneAndUpdate(
                { _id: req.params.id },
                {
                    full: req.body.full,
                },
                { new: true }
            );

            await QRCode.toFile(
                "./src/public/assets/img/qr/" + link.short + ".png",
                process.env.HOST_NAME + link.short,
                {
                    color: {
                        dark: "#00F", // Blue dots
                        light: "#0000", // Transparent background
                    },
                    type: "url",
                },
                function (err) {
                    if (err) throw err;
                    // console.log(done);
                }
            );

            req.session.alert = "updated";

            res.redirect("/link?page=" + page);
        } catch (e) {
            return res.redirect("/");
        }
    },
    store: async (req, res) => {
        try {
            
            let errors = validateHelper.getErrors(req);
            req.session.errors = errors;
            
            if (errors) {
            return res.redirect("/link");
        }

        let short = nanoid(8);
        let isExist = await Link.findOne({ short: short });
        
        while (isExist) {
            short = nanoid(8);
            isExist = await Link.findOne({ short: short });
        }
        
        const entity = {
            full: req.body.full,
            short: short,
            user_id: req.user._id,
        };
        
        let link = await Link.create(entity);
        
        await QRCode.toFile(
            "./src/public/assets/img/qr/" + link.short + ".png",
            process.env.HOST_NAME + link.short,
            {
                color: {
                    dark: "#00F", // Blue dots
                    light: "#0000", // Transparent background
                },
                type: "url",
            },
            function (err) {
                if (err) throw err;
                // console.log(done);
            }
            );
            
            req.session.alert = "created";
            res.redirect("/link");
        } catch (e) {
            return res.redirect("/");
        }
    },
    delete: async (req, res) => {
        try {
            let link_id = req.params.id;

            const link = await Link.findOne({ _id: link_id });

            if (!link) {
                return res.status(400).send({ error: "Link not found" });
            }

            if (link.user_id.equals(req.user._id) === false) {
                return res.status(400).send({
                    error: "You don't have permission to delete this link",
                });
            } else {
                await Link.deleteOne({ _id: link_id });

                req.session.alert = "deleted";
                res.redirect("/link");
            }
        } catch (e) {
            // console.log(e);
            return res.redirect("/");
        }
    },
    redirect: async (req, res, next) => {
        try {
            let link = await Link.findOne({ short: req.params.short });

            link.clicks++;
            await link.save();

            res.redirect(link.full);
        } catch (e) {
            // console.log(e);
            next();
        }
    },
};
