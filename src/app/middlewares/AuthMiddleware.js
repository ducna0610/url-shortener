import jwtHelper from "../helpers/jwt.helper.js";
import User from "../models/User.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default {
    isAuth: async (req, res, next) => {
        if (!req.cookies.token) {
            req.user = undefined;
            return res.redirect("/login");
        }

        const data = await jwtHelper.verifyToken(
            req.cookies.token,
            accessTokenSecret
        );
        let user = await User.findById(data.user._id);

        if (user == null) {
            return res.redirect("/login");
        }

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        next();
    },
};
