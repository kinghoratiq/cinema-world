var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Reservation = require("./models/reservations");
var Movie = require("./models/movies");

mongoose.connect("mongodb://localhost:27017/moviedb", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Create Route
app.post("/movies/:id/seats", function(req, res) {
	var date = req.body.showDate;
	var cinema = req.body.cinema;
	var movieID = req.params.id;
	var title = req.body.title;
	var newReservation = {date: date, cinema: cinema, movie: movieID, title: title};
	Reservation.findOne({date: date, movie: movieID}, function(err, foundReservation) {
		if(err) {
			console.log("ERROR IN CHECKING EXISTING RESERVATIONS");
	 		console.log(err);
		}
		else {
			if(foundReservation == null) {
				console.log("CREATING NEW RESERVATION");
				Reservation.create(newReservation, function(err, newlyCreated) {
					if(err) {
						console.log("ERROR IN POSTING NEW RESERVATION");
						console.log(err);
					}
					else {
						res.redirect("/movies/" + newlyCreated._id + "/seats");
					}
				});
			}
			else {
				console.log("EDITING EXISTING RESERVATION");
				res.redirect("/movies/" + foundReservation._id + "/seats");
			}
		}
	});	
});

//Index Route
app.get("/movies", function(req, res) {
	Movie.find({}, function(err, allMovies) {
		if(err) {
			console.log("ERROR IN FINDING MOVIES");
			console.log(err);
		}
		else
			res.render("index", {movies: allMovies});
	});
});

// Index Route for Reservations
app.get("/reservations", function(req, res) {
	Reservation.find({}, function(err, allReservations) {
		if(err) {
			console.log("ERROR IN FINDING RESERVATIONS");
			console.log(err);
		}
		else
			res.render("reservations", {reservations: allReservations});
	});
});

// New/Edit Route
app.get("/movies/:id/seats", function(req, res) {
	Reservation.findById(req.params.id, function(err, foundReservation) {
		if(err) {
			console.log("ERROR IN MOVING TO SEATS PAGE");
			console.log(err);
		}
		else {
			res.render("new", {reservation: foundReservation});
		}
	});
});

// Update Route
app.put("/movies/:id/seats", function(req, res) {
	var seatsArray = req.body.seatIndicator.split(",");
	for(var i = 0; i < seatsArray.length; i++) {
		if(seatsArray[i] == "None") {
			seatsArray.splice(i, 1);
			i--;
		}
		if(seatsArray[i] == "") {
			seatsArray.splice(i, 1);
			i--;
		}
	}
	Reservation.findByIdAndUpdate(req.params.id, {$push: {seats: seatsArray}}, {"new": true}, function(err, updatedReservation) {
		if(err) {
			console.log("ERROR IN UPDATING RESERVATION");
			console.log(err);
			res.redirect("/movies");
		}
		else {
			res.redirect("/reservations");
		}
	});
});

// Show Route
app.get("/movies/:id", function(req, res) {
	Movie.findById(req.params.id, function(err, foundMovie) {
		if(err) {
			console.log("ERROR IN SHOWING MOVIE PAGE");
			console.log(err);
		}
		else {
			res.render("show", {movie: foundMovie});
		}
	});
});

// Destroy Route
app.delete("/reservations", function(req, res) {
	var resID = req.body.cancelledID;
	Reservation.findByIdAndRemove(resID, function(err) {
		if(err) {
			console.log("ERROR IN DELETING RESERVATION");
			console.log(err);
		}
		else
			res.redirect("/reservations");
	});
});

app.listen(3000, function() {
	console.log("Cinema World server has started");
});