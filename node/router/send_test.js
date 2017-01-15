var util = require('util');
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

serialport.on("open", function () {
    var frame_obj = {
        type: 0x10, 
        id: 0x01, 
        destination64: "0013A20040E42735",
        broadcastRadius: 0x00,
        options: 0x00, 
        data: "Hello world" 
    };
    
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Sent to serial port.');
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
    console.log(">>", frame);
});
