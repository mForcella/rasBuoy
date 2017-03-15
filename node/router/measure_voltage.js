var ads1x15 = require('node-ads1x15');  

var chip = 1; //0 for ads1015, 1 for ads1115  
var adc = new ads1x15(chip); 

var chA = 0; //channel 0, 1, 2, or 3...  
var chB = 1;
var samplesPerSecond = '250'; // see index.js for allowed values for your chip  
var progGainAmp = '4096'; // see index.js for allowed values for your chip  

var reading  = 0;  

exports.readVoltage = function(callback) {
   if(!adc.busy)  
   {
      adc.readADCDifferential(chA, chB, progGainAmp, samplesPerSecond, function(err, data) {   
         if(err)  
         {  
            //logging / troubleshooting code goes here...  
            throw err;  
         }  
         // if you made it here, then the data object contains your reading!  
         reading = Math.round(data)/1000;
         // any other data processing code goes here...  
         callback(reading);
      });  
   }  
};
