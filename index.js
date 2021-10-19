var BME280 = require('bme280');
var Wreck = require('wreck');


BME280.open({
  i2cBusNumber: 1,
  i2cAddress: 0x76
}).then(async sensor => {
  let reading = await sensor.read();
  await sensor.close();

  let measurement = {
    temperature: parseFloat(reading.temperature.toFixed(2)),
    pressure: parseFloat(reading.pressure.toFixed(2)),
    humidity: parseFloat(reading.humidity.toFixed(2)),
    location: process.env.KOTIBOT_SENSOR_LOCATION
  };

  console.log(measurement);

  Wreck.post(process.env.KOTIBOT_SERVER_ENDPOINT, { payload: measurement }, (err, res, payload) => {
    if (err) {
      console.log('Error while posting measurement: ', err);
      return;
    }
    console.log('posted');
  });
}).catch(console.log);