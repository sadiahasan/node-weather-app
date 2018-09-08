const express = require("express");
const hbs = require('hbs');
const axios = require('axios');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
hbs.registerPartials(__dirname + '/views/partials');

const port = process.env.PORT || 3000;

const weather = require('./weather')

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
	res.render('home.hbs');
});

app.post('/weather',(req,res) => {
	var oldlocation = JSON.stringify(req.body.location);
	var location = oldlocation.replace(/['"]+/g, '');
	var geocodeURL = weather.getURL(req.body.location);
	
	axios.get(geocodeURL).then((response) => { //first promise
		var lat = response.data.results[0].geometry.location.lat;
		var lng = response.data.results[0].geometry.location.lng;
		var weatherUrl = `https://api.forecast.io/forecast/8fa491883cf46553f68e214bc3566e17/${lat},${lng}`;
		console.log(response.data.results[0].formatted_address);
		return axios.get(weatherUrl); //second promise
	}).then((response) => {
		var temperature = response.data.currently.temperature;
		var apparentTemperature = response.data.currently.apparentTemperature;
		
		res.render('weather.hbs', {
	    location: location,
		weatherMessage: `It's currently ${temperature} degrees, but it feels like ${apparentTemperature} degrees.` 
	})
	}).catch((e) => {
		if(e.code === 'ENOTFOUND') {

		}else{
			console.log(e.message);
			res.render('weather.hbs', {
				location: location,
				weatherMessage: 'Unable to connect to API servers'
			})
		}
});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
	}); 