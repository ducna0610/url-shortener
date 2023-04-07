import { checkSchema } from 'express-validator';

export default {
    rule: checkSchema({
        name: {
            notEmpty: {
                errorMessage: "Name is required!",
            },
            isLength: {
                errorMessage: "Name is should be in [6, 50] chars long!",
                options: {min:6, max: 50 },
            },
        },
    }),
};
