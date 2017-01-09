var ds18b20 = require('ds18b20');

ds18b20.sensors(function(err, ids) {
   var id = ids[0];
   ds18b20.temperature(id, function(err, value) {
      console.log('Current temperature is', value);
   });
});

