const mongoose = require('mongoose');
const otpModel = require('../models/otpModel');
const SERVICE = require('../models/common')

const sendOTP = async (req, res) => {
    try {
        var newOTP = Math.floor(100000 + Math.random() * 900000);
        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var rString = randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var responseData = {};
        const mobileNo = req.body.mobileNo;
        await otpModel.find({ mobileNo: mobileNo })
            .exec()
            .then(doc => {
                console.log("CHECK")
                if (doc.length && doc) {
                    doc.map((d, k) => {
                        // console.log('BLOCK TIME', d.userBlockTime);
                        if (doc.length && doc && d.userBlockTime != null && d.userBlockTime > new Date()) {
                            // console.log('User has been blocked');
                            res.status(200).json({
                                code: SERVICE.BLOCKED.code,
                                message: SERVICE.BLOCKED.msg,
                                data: responseData
                            });
                        }
                        else {
                            const mobileNo = req.body.mobileNo;
                            var newOTP = Math.floor(100000 + Math.random() * 900000);
                            otpModel.updateOne({ mobileNo: mobileNo }, { $set: { otp: newOTP } })
                                .exec()
                                .then(result => {
                                    console.log(result);
                                    responseData["otp"] = newOTP;
                                    responseData["txnId"] = d.txnId;
                                    res.status(200).json({
                                        code: SERVICE.SUCCESS.code,
                                        message: SERVICE.SUCCESS.msg,
                                        data: responseData
                                    });
                                }).catch(err => console.log(err));

                        }
                    })
                }
                else {
                    console.log('NOT EXIST');
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
                        console.log('RESULT' + result);
                        responseData["otp"] = otp_model.otp;
                        responseData["txnId"] = otp_model.txnId;
                        res.status(200).json({
                            code: SERVICE.SUCCESS.code,
                            message: SERVICE.SUCCESS.msg,
                            data: responseData
                        });
                    }).catch(err => console.log(err));
                }
            })
    }
    catch {
        err => console.log(err);
    }
}

const resendOTP = async (req, res) => {
    try {
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
                                code: SERVICE.SUCCESS.code,
                                message: SERVICE.SUCCESS.msg,
                                data: responseData
                            });
                        }).catch(err => console.log(err));
                }
                else {
                    res.status(200).json({
                        code: SERVICE.NOT_FOUND.code,
                        message: SERVICE.NOT_FOUND.msg
                    });
                }
            })
    }
    catch {
        err => {
            console.log(err);
            res.status(500).json({ error: err });
        }
    }
}

const verifyOTP = async (req, res) => {
    try {
        const txnId = req.body.txnId;
        await otpModel.find({ txnId: txnId })
            .exec()
            .then(doc => {
                console.log('inside verify OTP')
                doc.map((d, k) => {
                    if (d.unsuccessfulAttempt > 2) {
                        res.status(200).json({
                            code: SERVICE.BLOCKED.code,
                            message: SERVICE.BLOCKED.msg,
                        });
                    }
                    else if (d.otp === req.body.otp) {
                        res.status(200).json({ code: 'APP001', message: 'OTP verified' });
                    }
                    else {
                        var attempt = d.unsuccessfulAttempt + 1;
                        var blockTime = new Date();
                        if (attempt > 2) {
                            blockTime.setMinutes(blockTime.getMinutes() + 1);
                        }
                        console.log('ATTEMPT' + attempt);
                        otpModel.updateOne({ txnId: txnId }, { $set: { unsuccessfulAttempt: attempt, userBlockTime: blockTime } }).exec().then().catch(err => { console.log(err); })
                        res.status(202).json({
                            code: SERVICE.WRONG_OTP.code,
                            message: SERVICE.WRONG_OTP.msg,
                        });
                    }
                })

            })
    }
    catch {
        err => {
            console.log(err);
            res.status(500).json({ error: err });
        }
    }
}

module.exports = { sendOTP, resendOTP, verifyOTP }