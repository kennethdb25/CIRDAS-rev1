const mongoose = require("mongoose");

const missingPersonSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	age: {
		type: Number,
		required: true,
		trim: true,
	},
	imgpath: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
		trim: true,
	},
	year: {
		type: String,
		required: false,
		trim: true,
	},
	timeAndDate: {
		type: String,
		required: false,
	},
	municipal: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	contact: {
		type: String,
		required: true,
		trim: true,
	},
	status: {
		type: String,
		required: true,
		trim: true,
	},
});

const missingPerson = new mongoose.model("missingperson", missingPersonSchema);

module.exports = missingPerson;
