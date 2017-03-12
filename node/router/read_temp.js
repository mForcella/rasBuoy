var sensor = require('ds18x20');

// reads the temperatures from the sensors

exports.readTemps = function () {
   tempData = sensor.getAll();
   return tempData;

};
