var ds18b20 = require('ds18b20');

exports.readTemp = function () {
    var byteData;
    ds18b20.sensors(function (err, ids) {
        var id = ids[0];
        var data = [];
        var dataString = "";
        var temp = "temp|" + ds18b20.temperatureSync(id).toString();
        var date = new Date();
        var dataString = dataString + temp + "," + "date|" + date;
        data.push(dataString);
        byteData = toByteArray(data);
    });
    return byteData;
};

function toByteArray(data) {
    var bytes = [];
    var i;
    for (i = 0; i < data[0].length; ++i) {
        bytes.push(data[0].charCodeAt(i));
    }
    return bytes;
}