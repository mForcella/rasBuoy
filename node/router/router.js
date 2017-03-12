// This is the main router file. It runs every 15 minutes. 
// It collects data, writes it to the local database, 
// and sends it to the coordinator node. 

var temp = require('./read_temp.js');
var config = require('./read_config.js');
var db = require('./write_db.js');
var converter = require('./convert_data.js');
var xbee = require('./send_data.js');

// read data from sensors
var tempData = temp.readTemps();

// read config values
config.readConfig(function(values){
   var configValues = values;

   // add tempData to configData
   for (key in configValues) {
      if (key.indexOf("SENSOR_") > -1) {
         var sensorID = configValues[key]['SENSOR_ID'];
         for (id in tempData) {
            if (id == sensorID) {
               configValues[key]['MEASUREMENT_VALUE'] = tempData[id];
            }
         }
      }
   }

   // TODO read voltage

   // write to database
   db.writeDb(configValues);

   // convert to byte string
   var byteData = converter.arrayToByteString(configValues);

   // send to coordinator
   sendToXbee(byteData,0);
});

// recursive method takes data array and iterator. sends part of 
// array to xbee, sleeps for 2.5 seconds to ensure that serial port
// is clear, and recurses with next part of data.
function sendToXbee(byteData,i) {
   if (i < byteData.length) {
      xbee.sendData(byteData[i]);
      sleep(2500).then(()=>{
         sendToXbee(byteData,++i);
      });
   }
}

function sleep(time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}
