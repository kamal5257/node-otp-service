const mongoose = require('mongoose');
const otpModel = require('../models/otpModel');

const sendOTP = (req, res) => {
    try {
        console.log("ksdjsaf")
        var newOTP = Math.floor(100000 + Math.random() * 900000);
        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var rString = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var responseData = {};
        const otp_model = new otpModel({
            _id: new mongoose.Types.ObjectId(),
            mobileNo: req.body.mobileNo,
            otp: newOTP,
            unsuccessfulAttempt: 0,
            createdTime: new Date(),
            otpExpiryTime: new Date(),
            userBlockTime: new Date(),
            resendOtpCount: 0,
            txnId: rString

        });

        otp_model.save().then(result => {
            console.log(result);
            responseData["otp"] = otp_model.otp;
            responseData["txnId"] = otp_model.txnId;
            console.log("sdjfhhdgf");
            res.status(200).json({
                code: 'APP001',
                message: 'Request processed successfully',
                data: responseData
            });
        })
    }
    catch {
        err => console.log(err);
    }
}

module.exports = { sendOTP }