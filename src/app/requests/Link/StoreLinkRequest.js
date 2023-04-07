
import { checkSchema } from 'express-validator';

export default {
    rule: checkSchema({
        full: {
          notEmpty: {
              errorMessage: "Url is required!",
          },
          isLength: {
            errorMessage: "Url is should be at most 255 chars long!",
            options: { max: 255 },
          },
          matches: {
            errorMessage: `Url don't correct!`,
            options: /^(http[s]?:\/\/)?([^\/\s]+\/)(.*)/,
          }
        },
    })
};
