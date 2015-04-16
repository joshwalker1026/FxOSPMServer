// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var logger 	   = require('morgan');
var auth 	   = require('./config/auth');
var Project    = require('./app/models/project');
var Task       = require('./app/models/task');


mongoose.connect('mongodb://fxospm:Fish3m3m@ds061601.mongolab.com:61601/fxospm'); // connect to our database

app.use(logger('dev'));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router



// middleware to use for all requests
router.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/*', [require('./middlewares/validateRequest')]);
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// on routes that end in /login
// ----------------------------------------------------
app.use('/login', auth.login);

// on routes that end in /projects
// ----------------------------------------------------
router.route('/projects')

    // create a project (accessed at POST http://localhost:8080/api/projects)
    .post(function(req, res) {
        
        var project = new Project();      // create a new instance of the Project model
        project.name = req.body.name;  // set the projects name (comes from the request)

        // save the project and check for errors
        project.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Project '+ project.name +'created!' });
        });
        
    })

     // get all the projects (accessed at GET http://localhost:8080/api/projects)
    .get(function(req, res) {
        Project.find(function(err, projects) {
            if (err)
                res.send(err);

            res.json(projects);
        });
    });



// on routes that end in /projects/:project_id
// ----------------------------------------------------
router.route('/projects/:project_id')

    // get the project with that id (accessed at GET http://localhost:8080/api/projects/:project_id)
    .get(function(req, res) {
        Project.findById(req.params.project_id, function(err, project) {
            if (err)
                res.send(err);
            res.json(project);
        });
    })

     // update the project with this id (accessed at PUT http://localhost:8080/api/projects/:project_id)
    .patch(function(req, res) {

        // use our project model to find the project we want
        Project.findById(req.params.project_id, function(err, project) {

            if (err)
                res.send(err);

            project.name = req.body.name;  // update the projects info

            // save the project
            project.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Project updated!' });
            });

        });
    })

    // delete the project with this id (accessed at DELETE http://localhost:8080/api/projects/:project_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.project_id
        }, function(err, project) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// more routes for our API will happen here



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);