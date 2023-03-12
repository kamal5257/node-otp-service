const express = require('express');
const app = express();
const otpRoutes = require('./api/routes/otp-history');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://kchindaliya1998:Gargee7@ac-x2n0cht-shard-00-00.188fime.mongodb.net:27017,ac-x2n0cht-shard-00-01.188fime.mongodb.net:27017,ac-x2n0cht-shard-00-02.188fime.mongodb.net:27017/?ssl=true&replicaSet=atlas-b3rp1q-shard-0&authSource=admin&retryWrites=true&w=majority', 
{
    useNewUrlParser: true,
    
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/otp-service', otpRoutes);
app.use((req, res, next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;