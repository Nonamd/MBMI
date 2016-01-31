// app/routes.js

// REQUIRED FOR IMAGE UPLOAD
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var options = multer.diskStorage({ destination : 'public/uploads/' ,
  filename: function (req, file, cb) {
    cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: options });

// var upload = multer({ dest: 'uploads/' });

// load the Daygoals model
var Daygoal = require('./models/daygoal');


// expose the routes to our app with module.exports
module.exports = function(app, passport) {
	
	// routes ======================================================================

	// main page
	app.get('/', function(req, res) {
        res.render('index.ejs');  // load the index.ejs file
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.session.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

	// api ---------------------------------------------------------------------
	// get all daygoals
	app.get('/api/daygoals', function(req, res) {

	    // use mongoose to get all daygoals in the database
	    Daygoal.find(function(err, daygoals) {

	        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
	        if (err)
	            res.send(err)

	        res.json(daygoals); // return all daygoals in JSON format
	    });
	});

	// create daygoal and send back all daygoals after creation
	app.post('/api/daygoals', isApiLoggedIn, upload.single('file'), function(req, res) {

	    // create a daygoal, information comes from AJAX request from Angular
	    Daygoal.create({
	        text : req.body.info.text,
	        category: req.body.info.category,
	        weektarget: req.body.info.weektarget,
	        duration: req.body.info.duration,
	        author: req.session.user.local.display_name,
	        photo: req.file.filename,
	        done : false
	    }, function(err, daygoal) {
	        if (err)
	            res.send(err);

	        // get and return all the daygoals after you create another
	        Daygoal.find(function(err, daygoals) {
	            if (err)
	                res.send(err)
	            res.json(daygoals);
	        });
	    });

	});

	// delete a daygoal
	app.delete('/api/daygoals/:daygoal_id', function(req, res) {
	    Daygoal.remove({
	        _id : req.params.daygoal_id
	    }, function(err, daygoal) {
	        if (err)
	            res.send(err);

	        // get and return all the daygoals after you create another
	        Daygoal.find(function(err, daygoals) {
	            if (err)
	                res.send(err)
	            res.json(daygoals);
	        });
	    });
	});

	// application -------------------------------------------------------------
	// app.get('*', function(req, res) {
	//     res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	// });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isApiLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    // res.redirect('/login');
    res.send({ status: 'error', message: "Oops, you'll need to log in again to continue."});
}