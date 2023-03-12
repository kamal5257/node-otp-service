const Joi = require('joi');
const SERVICE = require('../models/common');

const validMobile = Joi.object({
    mobileNumber: Joi.number().integer().min(10 ** 9).required()
});

const validTxn = Joi.object({
    txnId: Joi.string().required()
});

const validReq = Joi.object({
    txnId: Joi.string().required(),
    otp: Joi.number().integer().min(10 ** 5).required().error((errors) => {
        errors.forEach((err) => {
            switch (err.code) {
                case 'number.min': err.message = SERVICE.INVALID_MOBILE;
                    break;
                default:
                    break;
            }
        });
        return errors;
    })

});

module.exports = { validReq, validTxn, validMobile }

