// We load the required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

// //we import the controllers
var locationController = require('./controllers/location');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

// Connect to the mapit database
mongoose.connect('mongodb://felix:mapitadmin@ds039411.mongolab.com:39411/heroku_app33632584');
 
// Create our Express application
var app = express();
 
// Connect to the mapit database (couldnt be simpler)
// mongoose.connect('mongodb://localhost:27017/abelmeanmap');
 
// Use the body-parser package in our application
// The body parser will let us parse the url-encoded http requests
// The "extended" syntax allows for rich objects and arrays to be encoded into
// the urlencoded format, allowing for a JSON-like experience with urlencoded.
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
 
// Create our router that
// will route the requests to the corresponding
// ressources
var router = express.Router();

// Create endpoint handlers for /locations
router.route('/locations')
.post(authController.isAuthenticated, locationController.postLocations)
.get(locationController.getLocations);
 
// Create endpoint handlers for /Locations/:Location_id
router.route('/locations/:location_id')
.get(authController.isAuthenticated, locationController.getLocation)
.put(authController.isAuthenticated, locationController.putLocation)
.delete(authController.isAuthenticated, locationController.deleteLocation);
 
//Create endpoint handlers for /users
router.route('/users')
.post(userController.postUsers)
.get(authController.isAuthenticated, userController.getUsers);
 
//Create endpoint handler for authenticating users
router.route('/authenticate')
.post(userController.authenticateUser);
 
// We tell our app to use
// our router with the api prefix
app.use('/api', router);
 
// We start the server by listening to port 3000
app.listen(process.env.PORT || 3000);
 
console.log("Server runnning WILD!!");