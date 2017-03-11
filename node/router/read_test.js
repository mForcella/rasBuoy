// This module will read values from router.conf

var lineReader = require('line-reader');

var readConfig = function() {

  var configValues = [];

  lineReader.open('router.conf', function(err, reader) {
    if (err) throw err;
    while (reader.hasNextLine()) {
      reader.nextLine(function(err, line) {

        // database values
        if (line.indexOf("HOST") > -1) {
          var host = line.split("=")[1];
          if (host.length == 0) host = "NA";
          configValues.push({key:"HOST",value:host});
        }
        if (line.indexOf("USER") > -1) {
          var user = line.split("=")[1];
          if (user.length == 0) user = "NA";
          configValues.push({key:"USER",value:user});
        }
        if (line.indexOf("PASSWORD") > -1) {
          var password = line.split("=")[1];
          if (password.length == 0) password = "NA";
          configValues.push({key:"PASSWORD",value:password});
        }
        if (line.indexOf("DATABASE") > -1) {
          var database = line.split("=")[1];
          if (database.length == 0) database = "NA";
          configValues.push({key:"DATABASE",value:database});
        }

        // node values
        if (line.indexOf("NODE_ID") > -1) {
          var node_id = line.split("=")[1];
          if (node_id.length == 0) node_id = "NA";
          configValues.push({key:"NODE_ID",value:node_id});
        }
        if (line.indexOf("LATITUDE") > -1) {
          var latitude = line.split("=")[1];
          if (latitude.length == 0) latitude = "NA";
          configValues.push({key:"LATITUDE",value:latitude});
        }
        if (line.indexOf("LONGITUDE") > -1) {
          var longitude = line.split("=")[1];
          if (longitude.length == 0) longitude = "NA";
          configValues.push({key:"LONGITUDE",value:longitude});
        }
        if (line.indexOf("ENVIRONMENT") > -1) {
          var environment = line.split("=")[1];
          if (environment.length == 0) environment = "NA";
          configValues.push({key:"ENVIRONMENT",value:environment});
        }

        // sensor values
        if (line.indexOf("SENSOR_ID") > -1) {
          var sensorValues = [];
          var sensorID = line.split("=")[1];
          if (sensorID.length == 0) sensorID = "NA";
          sensorValues.push({key:"SENSOR_ID",value:sensorID});
          reader.nextLine(function(err,line){
            var depth = line.split("=")[1];
            if (depth.length == 0) depth = "NA";
            sensorValues.push({key:"DEPTH_M",value:depth});
          });
          reader.nextLine(function(err,line){
            var measurementType = line.split("=")[1];
            if (measurementType.length == 0) measurementType = "NA";
            sensorValues.push({key:"MEASUREMENT_TYPE",value:measurementType});
          });
          reader.nextLine(function(err,line){
            var measurementUnits = line.split("=")[1];
            if (measurementUnits.length == 0) measurementUnits = "NA";
            sensorValues.push({key:"MEASUREMENT_UNITS",value:measurementUnits});
            configValues.push({key:"SENSOR_"+sensorID,value:sensorValues});
          });
        }

      });
    }
    console.log(configValues);
    reader.close(function(err) {
      if (err) throw err;
    });
  });
};

readConfig();
