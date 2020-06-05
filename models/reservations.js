var mongoose = require("mongoose");
var Movie = require("./movies.js");

// Reservations Schema Setup
var reservationsSchema  = new mongoose.Schema({
	date: String,
	cinema: Number,
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Movie"
	},
	title: String,
	seats: [{type: String}]
});

module.exports = mongoose.model("Reservation", reservationsSchema);