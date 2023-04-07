
export default {
    index: (req, res) => {
        try {
            res.render("pages/index", {
                title: "Home",
                user: req.user,
                layout: "./layouts/master",
            });
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
