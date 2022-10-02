const express = require("express");
const missingpersonRouter = new express.Router();
const multer = require("multer");
const missingPersonSchema = require("../../models/missing-personSchema/missing-personSchema");

const imgconfig = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./uploads");
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}. ${file.originalname}`);
	},
});

const isImage = (req, file, callback) => {
	if (file.mimetype.startsWith("image")) {
		callback(null, true);
	} else {
		callback(new Error("Only image is allowed"));
	}
};

const upload = multer({
	storage: imgconfig,
	fileFilter: isImage,
});

missingpersonRouter.post("/missing-person", upload.single("photo"), async (req, res) => {
	const { filename } = req.file;
	const { id, name, age, address, year, municipal, description, contact, status } = req.body;

	if (!id || !name || !age || !address || !year || !municipal || !description || !contact || !status || !filename) {
		res.status(422).json({ error: "Fill all required details" });
	} else {
		try {
			const finalMissingPerson = new missingPersonSchema({
				id,
				name,
				age,
				imgpath: filename,
				address,
				year,
				timeAndDate: `${new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}`,
				municipal,
				description,
				contact,
				status,
			});

			const storeData = await finalMissingPerson.save();

			res.status(201).json({ status: 201, storeData });
		} catch (error) {
			res.status(422).json(error);
			console.log("catch block error");
		}
	}
});

// get all missing person
missingpersonRouter.get("/missing-person", async (req, res) => {
	try {
		const missingPerson = await missingPersonSchema.find();
		res.status(200).json({ status: 200, body: missingPerson });
	} catch (error) {
		res.status(404).json(error);
	}
});

// get all missing person by status - Missing
missingpersonRouter.get("/missing-person/status", async (req, res) => {
	try {
		const missingPerson = await missingPersonSchema.find({ status: "Missing" });
		res.status(200).json({ status: 200, body: missingPerson });
	} catch (error) {
		res.status(404).json(error);
	}
});

// get all filed missing person by user id
missingpersonRouter.get("/missing-person/:id", async (req, res) => {
	try {
		const getFiledMissingPerson = await missingPersonSchema.find({ id: req.params.id });
		res.status(200).json({ status: 200, body: getFiledMissingPerson });
	} catch (error) {
		res.status(404).json(error);
	}
});

// get missing person Count by municipality
missingpersonRouter.get("/missing-person/count/:municipal", async (req, res) => {
	try {
		const getMissingCount = await missingPersonSchema.find({ municipal: req.params.municipal }).count();
		res.status(200).json({ status: 200, getMissingCount });
	} catch (error) {
		res.status(404).json(error);
	}
});

// graphdata
missingpersonRouter.get("/missing-persons/data", async (req, res) => {
	try {
		const getMissingCount = await missingPersonSchema.aggregate([
			{
				"$group": {
					"_id": "$year",
					"municipal": {
						"$count": {},
					},
				},
			},
		]);
		res.send(getMissingCount);
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = missingpersonRouter;
