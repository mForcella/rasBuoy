var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var db = require('./write_db.js');

//var C = xbee_api.constants;

var dataArray = {}; 

var xbee = new xbee_api.XBeeAPI({
    api_mode: 1
});

// get the xbee serial port
// '/dev/ttyAMA0' to read from serial port
// '/dev/ttyUSB0' to read from USB port
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: xbee.rawParser()
});

serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
xbee.on("frame_object", function (frame) {
   var stringArray = [];
   var data = frame['data'].toString();
   console.log(data);

   // split the data frame into pieces
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
   // add the current piece to the string array
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
            for (var j = i; j < i + 5; j++) {
               var key = values[j].split("=")[0];
               var value = values[j].split("=")[1];
               sensorArray[key] = value;
            }
            i = i + 4;
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
