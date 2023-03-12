const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const otpGenerator = require('otp-generator');
const otpModel = require('../models/otpModel')
const validation = require('../validation/validateRequest')
const {sendOTP} = require('../controller/appController');
const validate  = require('../validation/validation');


router.post('/send',(req,res,next) => validate(req,res,validation.validReq,next),sendOTP);

// router.post('/send', (req, res, next) => {


//     var newOTP = Math.floor(100000 + Math.random() * 900000);
//     function randomString(length, chars) {
//         var result = '';
//         for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
//         return result;
//     }
//     var rString = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
//     var responseData = {};
//     const otp_model = new otpModel({
//         _id: new mongoose.Types.ObjectId(),
//         mobileNo: req.body.mobileNo,
//         otp: newOTP,
//         unsuccessfulAttempt: 0,
//         createdTime: new Date(),
//         otpExpiryTime: new Date(),
//         userBlockTime: new Date(),
//         resendOtpCount: 0,
//         txnId: rString

//     });

//     otp_model.save().then(result => {
//         console.log(result);
//         responseData["otp"] = otp_model.otp;
//         responseData["txnId"] = otp_model.txnId;
//         res.status(200).json({
//             code: 'APP001',
//             message: 'Request processed successfully',
//             data: responseData
//         });
//     }).catch(err => console.log(err));

// });

router.post('/resend', (req, res, next) => {
    const txnId = req.body.txnId;
    var responseData = {};
    otpModel.find({ txnId: txnId })
        .exec()
        .then(doc => {
            console.log("DOC:: " + doc);
            if (doc) {
                var newOTP = Math.floor(100000 + Math.random() * 900000);
                otpModel.updateOne({ txnId: txnId }, { $set: { otp: newOTP } })
                    .exec()
                    .then(result => {
                        console.log(result);
                        responseData["otp"] = newOTP;
                        responseData["txnId"] = txnId;
                        res.status(200).json({
                            code: 'APP001',
                            message: 'Request processed successfully',
                            data: responseData
                        });
                    }).catch(err => console.log(err));
            }
            else {
                res.status(200).json({ code: 'APP904', message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});

router.post('/verify', (req, res, next) => {
    const txnId = req.body.txnId;
    otpModel.find({ txnId: txnId })
        .exec()
        .then(doc => {
            doc.map((d, k) => {
                if (d.unsuccessfulAttempt > 2) {
                    res.status(200).json({ code: 'APP003', message: 'User blocked !' });
                }
                else if (d.otp === req.body.otp) {
                    res.status(200).json({ code: 'APP001', message: 'OTP verified' });
                }
                else {
                    var attempt = d.unsuccessfulAttempt + 1;
                    console.log('ATTEMPT' + attempt);
                    otpModel.updateOne({ txnId: txnId }, { $set: { unsuccessfulAttempt: attempt } }).exec().then().catch(err => { console.log(err); })
                    res.status(202).json({ code: 'APP002', message: 'wrong OTP' });
                }
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});
module.exports = router;