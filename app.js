const express = require("express");
const hbs = require('hbs');
const axios = require('axios');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
hbs.registerPartials(__dirname + '/views/partials');

const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
	res.render('home.hbs');
});

app.post('/weather',(req,res) => {
	var oldlocation = JSON.stringify(req.body.location);
	var location = oldlocation.replace(/['"]+/g, '');

	var encodedAddress = encodeURIComponent(req.body.location);
	var geocodeURL = `http://www.mapquestapi.com/geocoding/v1/address?key=D2seL6d8VWI8O4cYGqlrFLiCzpqaG6bZ&location=${encodedAddress}`;
	console.log(geocodeURL);
	
	axios.get(geocodeURL).then((response) => { //first promise
		console.log(response);
		var lat = response.data.results[0].locations[0].latLng.lat;
		var lng = response.data.results[0].locations[0].latLng.lng;
		var country = response.data.results[0].locations[0].adminArea1;
		console.log(country);
		location = location.charAt(0).toUpperCase() + location.slice(1);
		location = location + `, ${country} `;
		var weatherUrl = `https://api.forecast.io/forecast/8fa491883cf46553f68e214bc3566e17/${lat},${lng}`;
		console.log(response.data.results[0].formatted_address);
		return axios.get(weatherUrl); //second promise
	}).then((response) => {
		var temperature = response.data.currently.temperature;

		// var rain;
		// var humidity;
		// var weekly;
		var today = response.data.hourly.summary.charAt(0).toLowerCase() + response.data.hourly.summary.slice(1);

		res.render('weather.hbs', {
	    location: location,
		weatherMessage: `It will be ${today} It's currently ${temperature} degrees` 
	})
	}).catch((e) => {
		if(e.code === 'ENOTFOUND') {

		}else{
			console.log(e.message);
			res.render('weather.hbs', {
				location: location,
				weatherMessage: e.message
			})
		}
});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
	}); 