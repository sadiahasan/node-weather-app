const request = require('request');
const axios = require('axios');

function getURL(location){
  var encodedAddress = encodeURIComponent(location);
  var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
  return geocodeURL;
}



// var getLatLng = (geocodeURL, callback) => {
//   request({
//     url: geoCodeURL,
//     json: true
//   }, (error, response, body) => {
//     if(error) {
//       callback('Unable to connect to weather API server');
//     }else if(response.statusCode === 2000) {
//       callback(undefined, {
//         address: body.results[0].formatted_address,
//         lat: body.results[0].geometry.location.lat,
//         lng:body.results[0].geometry.location.lng
//       });
//     }
//   });
// };

// module.exports.getLatLng = getLatLng;



module.exports.getURL = getURL;

