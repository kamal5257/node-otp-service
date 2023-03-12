const Joi = require('joi');

 const validReq = {
    body:Joi.object({
        mobileNumber: Joi.number().required()
    })
};


module.exports = validReq

