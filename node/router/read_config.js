// This module will read values from router.conf

var lineReader = require('line-reader');

exports.readConfig = function(callback) {

   var configValues = {};
   var i = 0;

   lineReader.open('router.conf', function(err, reader) {
      if (err) throw err;
      while (reader.hasNextLine()) {
         reader.nextLine(function(err, line) {

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
               reader.nextLine(function(err,line){
                  var depth = line.split("=")[1];
                  if (depth.length > 0) {
                     sensorValues["DEPTH_M"] = depth;
                  }
               });
               reader.nextLine(function(err,line){
                  var measurementType = line.split("=")[1];
                  if (measurementType.length > 0) {
                     sensorValues["MEASUREMENT_TYPE"] = measurementType;
                  }
               });
               reader.nextLine(function(err,line){
                  var measurementUnits = line.split("=")[1];
                  if (measurementUnits.length > 0) {
                     sensorValues["MEASUREMENT_UNITS"] = measurementUnits;
                  }
                  configValues["SENSOR_"+i++] = sensorValues;
               });
            }
         });
      }
      reader.close(function(err) {
         if (err) throw err;
         callback(configValues);
      });
   });
};
