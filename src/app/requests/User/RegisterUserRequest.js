import { checkSchema } from 'express-validator';

export default {
    rule: checkSchema({
        email: {
            notEmpty: {
                errorMessage: "Email is required!",
            },
            isEmail: {
                errorMessage: `Email is don't accept!`,
            },
            isLength: {
                errorMessage: "Email is should be at most 50 chars long!",
                options: { max: 50 },
            },
        },
        name: {
            notEmpty: {
                errorMessage: "Name is required!",
            },
            isLength: {
                errorMessage: "Name is should be in [6, 50] chars long!",
                options: {min:6, max: 50 },
            },
        },
        password: {
            notEmpty: {
                errorMessage: "Password is required!",
            },
            isLength: {
                errorMessage: "Name is should be at most 255 chars long!",
                options: { max: 255 },
            },
        },
        confirm_password: {
            notEmpty: {
                errorMessage: "Confirm password is required!",
            },
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error(
                            "Password confirmation does not match password!"
                        );
                    }
                    return true;
                },
            },
        },
    }),
};
