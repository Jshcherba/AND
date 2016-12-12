var express = require('express');
var mongoose = require('mongoose');
var app = express();
var userSchema = require("./model/user");

mongoose.connect('mongodb://localhost:27017/user', function (error) {
    if (error)return console.log(error);
    console.log("MongoDB: connection to database succesful!");
    var serverApp = app.listen(80, function () {
        console.log('Express server listening on port ' + serverApp.address().port);
    });
});
var db = mongoose.connection;
db.on('error', function callback(err) {console.log("Database connection failed. Error: " + err);});
db.once('open', function callback() {console.log("Database connection successful.");});

var User = db.model('user', userSchema);

// URLS management
app.get('/', function (req, res) {

    res.send("<a href='/users'>Show Users</a>");
});

app.get('/users', function (req, res) {
    User.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.post('/users/create', function (req, res) {
    console.log("in /users/create");
    var userModelJson = req.body;
    var userModel = new User(userModelJson);

    userModel.save(function(error) {
        if(error) {
            console.log(error);
            return res.json({msg: "error"});
        }
        console.log("user created: " + userModel.name);
        res.json(userModel);
    });
});

var user2 = new User({name:"ssss",age:14,address:"asdasd",active:true});


user2.save(function(error) {
    if(error) {
        console.log(error);
        return res.json({msg: "error"});
    }
    console.log("user created: " + user2.name);
});



var endMongoConnection = function() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', endMongoConnection).on('SIGTERM', endMongoConnection);