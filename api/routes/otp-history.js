const express = require('express');
const router = express.Router();
const validation = require('../validation/validateRequest')
const {sendOTP,resendOTP,verifyOTP} = require('../controller/appController');
const validate  = require('../validation/validation');

router.post('/send',(req,res,next) => validate(req,res,validation.validMobile,next),sendOTP);
router.post('/resend',(req,res,next) => validate(req,res,validation.validTxn,next),resendOTP);
router.post('/verify',(req,res,next) => validate(req,res,validation.validReq,next),verifyOTP);

module.exports = router;