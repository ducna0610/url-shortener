import { validationResult } from 'express-validator';

export default {
    getErrors: (req) => {
        let errors = null;
        let validations = validationResult(req);
        
        if (!validations.isEmpty()) {
            errors = validations.errors.reduce((group, error) => {
                const { param, value } = error;
                group[param] = group[param] ?? {};
                group[param].msg = group[param].msg ?? [];
                group[param].value = value;
                group[param].msg.push(error.msg);
                return group;
            }, {});
        }

        return errors;
    },
};
