var BME280 = require('node-bme280');
var Wreck = require('wreck');
var barometer = new BME280({address: 0x76});

barometer.begin(function(err) {
  if(err) {
    console.info('error initializing barometer', err);
    return;
  }

  console.log('barometer running');

  setInterval(function() {
    barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
      console.info(
        'temp:', temperature.toFixed(2),
	'C pressure: ', (pressure/100).toFixed(2),
	'hPa  hum: ', humidity.toFixed(2),
	'%');
      var measurement = {
      	temperature: temperature.toFixed(2),
	pressure:    (pressure/100).toFixed(2),
        humidity:    humidity.toFixed(2),
	location: process.env.KOTIBOT_SENSOR_LOCATION
      };

      Wreck.post( process.env.KOTIBOT_SERVER_ENDPOINT, {payload: measurement}, (err, res, payload) => {
        if(err) {
	  console.log('Error while posting measuremet: ', err);
	  return;
	}	
	console.log('Measurement posted');
      });
    });
  }, 600000);
});
