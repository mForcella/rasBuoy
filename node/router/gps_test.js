// This module will query the gps and write latitude and longitude to router.conf

var gpsd = require('node-gpsd');
var router = require('./router_helpers.js');

var latitudes = [];
var longitudes = [];
var daemons = [];

// create a gps daemon on the specified port
function createDaemon(port) {
   var device = '/dev/ttyUSB'+port;
   // start the gps daemon
   var daemon = new gpsd.Daemon({
      program: 'gpsd',
      device: device,
      port: 2947,
      pid: '/tmp/gpsd.pid',
      readOnly: false,
      logger: {
         info: function() {},
         warn: console.warn,
         error: console.error
      }
   });
   // add daemon to array
   daemons.push(daemon);
}

// start a daemon on the specified port
function startDaemon(port,daemon) {
   daemon.start(function() {
      console.log('Started Daemon on USB'+port);
   });
}

// attempt to kill a daemon on the specified port
function stopDaemon(port,daemon) {
   try {
      daemon.stop(function() {
         console.log('Killed Daemon on USB'+port);
      });
   } catch (err) {
      console.log("Daemon already killed");
   }
}

// create a daemon on USB ports 0-3
// gps will probably be on USB0, but we will check them all
for (var i = 0; i < 4; i++) {
   createDaemon(i);
}

// start a daemon on USB ports 0-3
for (var i = 0; i < 4; i++) {
   startDaemon(i,daemons[i]);
}

// create a gpsd listener

var listener = new gpsd.Listener({
   port: 2947,
   hostname: 'localhost',
   logger:  {
      info: function() {},
      warn: console.warn,
      error: console.error
   },
   parse: true
});

// connect listener
listener.connect(function() {
   console.log('Listener Connected');
});

// TPV data emitted if parse is 'true'
listener.on('TPV', function(data) {
   //console.log(data);
   // add lat/long to array
   if (data['lat'] != undefined) {
      latitudes.push(data['lat']);
      longitudes.push(data['lon']);
   }
   // check array size, stop at 10
   if (latitudes.length == 10) {
      var latitude = 0;
      var longitude = 0;
      // average values, output to file, exit
      for (var i in latitudes) {
         latitude += latitudes[i];
         longitude += longitudes[i];
      }
      latitude /= 10;
      longitude /= 10;
      // round to 8 decimal places
      latitude = latitude.toFixed(8);
      longitude = longitude.toFixed(8);
      // write output to router.conf
      router.writeLocation(latitude,longitude);
      // kill all the daemons
      for (var i = 0; i < 4; i++) {
         stopDaemon(i,daemons[i]);
      }
      // exit program
//      process.exit();
   }
});

// raw data emitted if parse is 'false'
//listener.on('raw', function(data) {
//  console.log(data);
//});

listener.watch({class: 'WATCH', json: true, nmea: false});

// set a timeout function for 30 seconds
setTimeout(function(){
   console.log('GPS timeout');
   // kill all the daemons
   for (var i = 0; i < 4; i++) {
      stopDaemon(i,daemons[i]);
   }
   process.exit();
},30000);
