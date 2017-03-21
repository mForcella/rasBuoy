// This module will read values from coord.conf
var lineReader = require('line-reader');

exports.readConfig = function(callback) {

   var configValues = {};
   var lines = [];

   // read lines config into array
   lineReader.eachLine('/home/pi/dev/rasBuoy/node/coord/coord.conf', function(line, last) {
      lines.push(line);
      if (last) {
         // get data from config file
         for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            // xbee port
            if (line.indexOf("XBEE_PORT") > -1) {
               var xbee_port = line.split("=")[1];
               if (xbee_port.length > 0) {
                  configValues["XBEE_PORT"] = xbee_port;
               }
            }

            // database values
            if (line.indexOf("HOST") > -1) {
               var host = line.split("=")[1];
               if (host.length > 0) {
                  configValues["HOST"] = host;
               }
            }
            if (line.indexOf("USER") > -1) {
               var user = line.split("=")[1];
               if (user.length > 0) {
                  configValues["USER"] = user;
               }
            }
            if (line.indexOf("PASSWORD") > -1) {
               var password = line.split("=")[1];
               if (password.length > 0) {
                  configValues["PASSWORD"] = password;
               }
            }
            if (line.indexOf("DATABASE") > -1) {
               var database = line.split("=")[1];
               if (database.length > 0) {
                  configValues["DATABASE"] = database;
               }
            }
            if (line.indexOf("TABLE") > -1) {
               var table = line.split("=")[1];
               if (table.length > 0) {
                  configValues["TABLE"] = table;
               }
            }
         }
         callback(configValues);
      }
   });
};
