var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var userSchema = require("./model/user");
var engine = require('consolidate');
var path = require('path');
var app = express();

app.set('views', __dirname + '/dist');
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'dist/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/user2', function (error) {
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
    res.render('index');
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

var endMongoConnection = function() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
};

process.on('SIGINT', endMongoConnection).on('SIGTERM', endMongoConnection);