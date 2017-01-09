var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var coord = require('./coord_helpers.js');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

// get the xbee serial port
// '/dev/ttyAMA0' to read from serial port
// '/dev/ttyUSB0' to read from USB port
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
// frame['data'] is a data string
xbeeAPI.on("frame_object", function (frame) {
    //console.log(">>", frame['data'].toString());
    //console.log(">>", util.inspect(frame["data"].toString()));
    var JSONData = coord.dataToJSON(frame['data'].toString());
    console.log(JSONData);
});
