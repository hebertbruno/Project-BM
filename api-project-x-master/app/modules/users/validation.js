const Joi = require('joi');


const Example = {
    name: Joi.string().max(20).trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).max(20).alphanum()
        .required()
        .trim(),
};

module.exports = {
    insert: {
        body: Example,
    },
    update: {
        params: {
            id: Joi.string().required(),
        },
        body: Example,
    },
};
