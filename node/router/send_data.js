// This module will send byte data through the XBee

var xbee = require('xbee-api');

var xbeeAPI = new xbee.XBeeAPI({
   api_mode: 1
});

exports.sendData = function(data,serialport) {

      var frame_obj = {
         type: 0x10,
         id: 0x01,
         broadcastRadius: 0x00,
         options: 0x00,
         data: data
      };

      serialport.write(xbeeAPI.buildFrame(frame_obj));

};
