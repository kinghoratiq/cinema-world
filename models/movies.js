var mongoose = require("mongoose");

// Movie Schema Setup
var movieSchema = new mongoose.Schema({
	title: String,
	image: String,
	cinema: Number
});

module.exports = mongoose.model("Movie", movieSchema);