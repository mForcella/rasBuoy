// This is the main router file. 
// It will run at boot time, open the serial port, and listen for incoming data.
// Every 15 minutes it will take a reading, write the database and send data.

var temp = require('./read_temp.js');
var config = require('./read_config.js');
var db = require('./write_db.js');
var incoming = require('./write_incoming.js');
var converter = require('./convert_data.js');
var xbee = require('./send_data.js');
var adc = require('./measure_voltage.js');
var uuidV4 = require('uuid/v4');
var serial = require('serialport');
var xbee_api = require('xbee-api');
var SerialPort = require('serialport');

var configValues;
var serialport;
var dataArray = {};

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

// read config values
config.readConfig(function(values){
   configValues = values;

   // get the serial port value
   var xbeePort = configValues['XBEE_PORT'];

   // open serial port
   serialport = new serial(xbeePort, {
      baudrate: 9600,
      parser: xbeeAPI.rawParser()
   });

   // listen for incoming data
   xbeeAPI.on("frame_object", function (frame) {
      if (frame['data'] != null) {
         var stringArray = [];

         // split the data frame into pieces
         var data = frame['data'].toString();
         var stringPart = data.split("|")[0];
         var identPart = data.split("|")[1];
         var identifier = identPart.split("-")[0];
         var section = identPart.split("-")[1];

         // check if we received the final piece
         var done = false;
         if (section.indexOf("%") > -1) {
            // remove end identifier and mark section as done
            section = section.split("%")[0];
            done = true;
         }

         // get the current string array if it exists
         if (dataArray[identifier] != null) {
            stringArray = dataArray[identifier];
         }
         // add current piece to string array
         stringArray[section] = stringPart;
         dataArray[identifier] = stringArray;

         // process the data when all pieces are received
         if (done) {
            // rebuild the string
            var dataString = "";
            for (chunk in stringArray) {
               dataString += stringArray[chunk];
            }

            // get data values from string
            var values = dataString.split("<=>");

            // build dictionary from values
            var valueArray = {};
            var sensorNum = 0;
            for (var i = 0; i < values.length; i++) {
               if (values[i].indexOf("SENSOR_ID") > -1) {
                  var sensorArray = {};
                  for (var j = i; j < i + 6; j++) {
                     var key = values[j].split("=")[0];
                     var value = values[j].split("=")[1];
                     sensorArray[key] = value;
                  }
                  i = i + 5;
                  valueArray['SENSOR_'+sensorNum++] = sensorArray;
               } else {
                  var key = values[i].split("=")[0];
                  var value = values[i].split("=")[1];
                  valueArray[key] = value;
               }
            }
            // enter incoming values into the database
            var duplicate = incoming.writeDb(valueArray);

            // send data if it is new
            if (!duplicate) {
               // convert data to byte string
               var byteData = converter.arrayToByteString(valueArray);

               // send data to xbee
               sendToXbee(byteData,serialport,0)
            }
         }
      }
   });

   // start the sensor reading cycle
   sleep(60000).then(()=>{
      startReading();
   });
});

// read the sensor every fifteen minutes
function startReading() {
   readSensor();
   sleep(900000).then(()=>{
      startReading();
   });
}

// takes a reading from the temperature sensor
function readSensor() {
   // read data from sensors
   var tempData = temp.readTemps();

   // add tempData to configData
   for (key in configValues) {
      if (key.indexOf("SENSOR_") > -1) {
         var sensorID = configValues[key]['SENSOR_ID'];
         for (id in tempData) {
            if (id == sensorID) {
               configValues[key]['MEASUREMENT_VALUE'] = tempData[id];
            }
         }
         // add measurement ID
         configValues[key]['ID'] = uuidV4();
      }
   }

   // get datetime
   configValues['DATE'] = new Date().toISOString().slice(0, 19).replace('T', ' ');

   // get xbee port
   xbeePort = configValues['XBEE_PORT'];

   // attempt to measure voltage
   adc.readVoltage(function(voltage){
      if (voltage > 0) {
         configValues['VOLTAGE'] = voltage;
      }

      // write to database
      db.writeDb(configValues);

      // convert data to byte string
      var byteData = converter.arrayToByteString(configValues);

      // send data to xbee
      sendToXbee(byteData,serialport,0)
   });
}

// send part of data to xbee, sleep for 1 second and continue
function sendToXbee(byteData,serialport,i) {
   if (i < byteData.length) {
      xbee.sendData(byteData[i],serialport);
      sleep(1000).then(()=>{
         sendToXbee(byteData,serialport,++i);
      });
   }
}

function sleep(time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}
