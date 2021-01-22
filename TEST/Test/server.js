/*eslint no-console: 0*/
"use strict";

const request = require("request");
// var port = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
//const axios = require("axios");

const db = require("./pokedex.json");
const jobs = require("./jobs.json");
const colls = require("./coll.json");
const cra = require("./cra.json");
const app = express();
app.use(bodyParser.json());

app.post('/pokemon-informations', getPokemonInformations);
app.post('/pokemon-evolutions', getPokemonEvolutions);
app.post('/jobs', getJobs);
app.post('/coll', getColls);
app.post('/test', getTest);
app.post('/cra', getCRA);
app.get('/def', getDEF);
app.post('/errors', function (req, res) {
	console.error(req.body);
	res.sendStatus(200);
});

// Start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

function findPokemonByName(name) {
	const data = db.find(p => p.name.toLowerCase() === name.toLowerCase());
	if (!data) {
		return null;
	}
	return data;
}

function formatEvolutionString(evolution) {
	let base = `🔸 ${evolution.name}`;
	if (evolution.trigger === 'leveling') {
		base += ` -> lvl ${evolution.trigger_lvl}`;
	}
	if (evolution.trigger === 'item') {
		base += ` -> ${evolution.trigger_item}`;
	}
	return base;
}

function getPokemonInformations(req, res) {
	console.log(req.body);
	const pokemon = req.body.conversation.memory.pokemon;
	const pokemonInfos = findPokemonByName(pokemon.value);
	if (!pokemonInfos) {
		res.json({
			replies: [{
				type: 'text',
				content: `I don't know a Pokémon called ${pokemon} :(`
			}]
		});
	} else {
		res.json({
			replies: [{
				type: 'text',
				content: `${pokemonInfos.name} infos`
			}, {
				type: 'text',
				content: `Type(s): ${pokemonInfos.types.join(' and ')}`
			}, {
				type: 'text',
				content: pokemonInfos.description
			}, {
				type: 'picture',
				content: pokemonInfos.image
			}]
		});
	}
}

function getPokemonEvolutions(req, res) {
	console.log(req.body);
	const pokemon = req.body.conversation.memory.pokemon;
	const pokemonInfos = findPokemonByName(pokemon.value);
	if (!pokemonInfos) {
		res.json({
			replies: [{
				type: 'text',
				content: `I don't know a Pokémon called ${pokemon} :(`
			}]
		});
	} else if (pokemonInfos.evolutions.length === 1) {
		res.json({
			replies: [{
				type: 'text',
				content: `${pokemonInfos.name} has no evolutions.`
			}]
		});
	} else {
		res.json({
			replies: [{
				type: 'text',
				content: `${pokemonInfos.name} family`
			}, {
				type: 'text',
				content: pokemonInfos.evolutions.map(formatEvolutionString).join("\n")
			}, {
				type: 'card',
				content: {
					title: 'See more about them',
					buttons: pokemonInfos.evolutions
						.filter(p => p.id !== pokemonInfos.id) // Remove initial pokemon from list               
						.map(p => ({
							type: 'postback',
							title: p.name,
							value: `Tell me more about ${p.name}`
						}))
				}
			}]
		});
	}
}

function getColls(req, res) {
	var contents = [];
	var content = {};
	for (var i = 0; i < colls.length; i++) {
		var obj = colls[i];
		content.title = obj.fullname;
		content.subtitle = obj.contacts[0].email;
		contents.push(content);
		content = {};
	}
	res.json({
		replies: [{
			type: "list",
			content: {
				elements: contents
			}
		}]
	});
}

function getJobs(req, res) {
	var contents = [];
	var content = {};
	var button = {};
	for (var i = 0; i < jobs.length; i++) {
		var obj = jobs[i];
		content.title = obj.name;
		content.subtitle = obj.date;
		content.imageUrl = obj.image;
		button.value = obj.lien;
		button.title = "EN SAVOIR PLUS";
		button.type = "web_url";
		content.buttons = [];
		content.buttons.push(button);
		contents.push(content);
		content = {};
		button = {};

	}
	res.json({
		replies: [{
			type: "carousel",
			content: contents
		}]
	});

}

function getCRA(req, res) {
	
	var contents = [];
	var content = {};
	for (var i = 0; i < cra.length; i++) {
		var obj = cra[i];
		content.title = obj.fullName;
		content.subtitle = obj.updatedAt;
		content.description = obj.status; 
		contents.push(content);
		content = {};
	}
	res.json({
		replies: [{
			type: "list",
			content: {
				elements: contents
			}
		}]
	});
}

function getDEF(req, res) {

	res.json({
		def: 'Specialized in new technologies, Aymax supports its customers and partners in their technical development, configuration and functional customization of their connected platforms to achieve ever greater flexibility and agility.'
	});
}