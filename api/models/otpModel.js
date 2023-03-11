const mongoose = require('mongoose');
const otpSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    mobileNo: Number,
    otp:Number,
    unsuccessfulAttempt: Number,
    createdTime:{type:Date, default:Date.now()},
    otpExpiryTime:{type:Date, default:Date.now()},
    userBlockTime:{type:Date, default:Date.now()},
    resendOtpCount:Number,
    txnId:String    
}
);
module.exports = mongoose.model('otpModel', otpSchema);