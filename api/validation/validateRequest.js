const Joi = require('joi');

 const validReq = Joi.object({
        mobileNumber: Joi.number().integer().min(10 ** 9).required()});


module.exports = {validReq}

