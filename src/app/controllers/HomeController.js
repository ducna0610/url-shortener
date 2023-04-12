import User from "../models/User.js";

export default {
    index: async (req, res) => {
        try {
            if (req.user.role == 1) {
                let users = await User.aggregate([
                    { $match: { role: 0 } },
                    {
                        $lookup: {
                            from: "links",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "links",
                        },
                    },
                ]);
                
                let num_user = users.length;

                let countLinks = (total, user) => {
                    return total + user.links.length;
                }
                
                let num_link = users.reduce(countLinks, 0);

                
                let countClicks = (total, link) => {
                    return total + link.clicks;
                }

                let num_click = users.reduce((total, user) => {
                    return total + user.links.reduce(countClicks, 0);
                }, 0);

                res.render("pages/admin", {
                    title: "Home",
                    user: req.user,
                    num_user: num_user,
                    num_link: num_link,
                    num_click: num_click,
                    layout: "./layouts/master",
                });
            } else {
                res.render("pages/index", {
                    title: "Home",
                    user: req.user,
                    layout: "./layouts/master",
                });
            }
        } catch (e) {
            // console.log(e);
        }
    },
    about: (req, res) => {
        try {
            res.render("pages/about", {
                title: "About",
                user: req.user,
                layout: "./layouts/master",
            });
        } catch (e) {
            // console.log(e);
            return res.redirect("/");
        }
    },
};
