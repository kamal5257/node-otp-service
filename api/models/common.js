const SERVICE = {
    SUCCESS: { code: 'APP001', msg: 'Request processed successfully' },
    BLOCKED: { code: 'APP002', msg: 'User has been blocked' },
    WRONG_OTP: { code: 'APP003', msg: 'Wrong OTP' },
    INVALID_MOBILE:{code:'APP004',msg:'Invalid Mobile Number'},
    INVALID_MOBILE:{code:'APP005',msg:'Invalid OTP'},
    NOT_FOUND: { code: 'APP904', msg: 'No valid entry found for provided ID' }

}

module.exports = SERVICE