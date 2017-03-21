// This is the main coordinator module.
// It runs at boot time and listens for incoming data.

var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var db = require('./write_incoming.js');
var config = require('./read_config.js');

var dataArray = {}; 

var xbee = new xbee_api.XBeeAPI({
    api_mode: 1
});

// read config values
config.readConfig(function(values){
   configValues = values;

   // get serial port
   var xbeePort = configValues['XBEE_PORT'];

   // get the xbee serial port
   var serialport = new SerialPort(xbeePort, {
       baudrate: 9600,
       parser: xbee.rawParser()
   });

   // look for incoming data on serial port
   xbee.on("frame_object", function (frame) {
      var stringArray = [];

      // split the data frame into pieces
      var data = frame['data'].toString();
      console.log(data);
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
         // enter values into the database
         db.writeDb(valueArray);
      }
   });
});
