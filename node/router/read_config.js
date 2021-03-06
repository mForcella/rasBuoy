// This module will read values from router.conf

var lineReader = require('line-reader');

exports.readConfig = function(callback) {

   var configValues = {};
   var sensorId = 0;
   var lines = [];

   // read lines config into array
   lineReader.eachLine('/home/pi/dev/rasBuoy/node/router/router.conf', function(line, last) {
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
      
            // node values
            if (line.indexOf("NODE_ID") > -1) {
               var nodeID = line.split("=")[1];
               if (nodeID.length > 0) {
                  configValues["NODE_ID"] = nodeID;
               }
            }
            if (line.indexOf("LATITUDE") > -1) {
               var latitude = line.split("=")[1];
               if (latitude.length > 0) {
                  configValues["LATITUDE"] = latitude;
               }
            }
            if (line.indexOf("LONGITUDE") > -1) {
               var longitude = line.split("=")[1];
               if (longitude.length > 0) {
                  configValues["LONGITUDE"] = longitude;
               }
            }
            if (line.indexOf("ENVIRONMENT") > -1) {
               var environment = line.split("=")[1];
               if (environment.length > 0) {
                  configValues["ENVIRONMENT"] = environment;
               }
            }
      
            // sensor values
            if (line.indexOf("SENSOR_ID") > -1) {
               var sensorValues = {};
               var sensorID = line.split("=")[1];
               if (sensorID.length > 0) {
                  sensorValues["SENSOR_ID"] = sensorID;
               }
               line = lines[++i];
               var depth = line.split("=")[1];
               if (depth.length > 0) {
                  sensorValues["DEPTH_M"] = depth;
               }
               line = lines[++i];
               var measurementType = line.split("=")[1];
               if (measurementType.length > 0) {
                  sensorValues["MEASUREMENT_TYPE"] = measurementType;
               }
               line = lines[++i];
               var measurementUnits = line.split("=")[1];
               if (measurementUnits.length > 0) {
                  sensorValues["MEASUREMENT_UNITS"] = measurementUnits;
               }
               configValues["SENSOR_"+sensorId++] = sensorValues;
            }
         }
         callback(configValues);
      }
   });
};
