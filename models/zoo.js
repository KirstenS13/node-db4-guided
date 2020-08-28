const db = require("../data/config")

function find() {
	return db("zoos")
}

function findById(id) {
	return db("zoos")
		.where("id", id)
		.first()
}

function findAnimals(zooId) {
	return db("zoos_animals as za")
		.join("zoos as z", "z.id", "za.zoo_id")
		.join("animals as a", "a.id", "za.animal_id")
		.join("species as s", "s.id", "a.species_id")
		.where("za.zoo_id", zooId)
		.select("a.id", "a.name", "s.name as species", "za.from_date", "za.to_date")
}

module.exports = {
	find,
	findById,
	findAnimals
}