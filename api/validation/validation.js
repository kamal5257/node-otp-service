// const validReq = require("./validateRequest");

const validate =  (req, res,validReq,next) => {
    const { error, value } = validReq.validate(req.body);
    if (error) {
        if (JSON.stringify(error.details[0].message).includes("must be greater than or equal to")){
            console.log("error",error)
          res.status(400).send(" Invalid Mobile Number");
          return;
        }
      res.status(400).send(error.details[0].message);
      return;
    }
    next();
}

module.exports = validate