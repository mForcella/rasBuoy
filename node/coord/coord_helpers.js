var JSONData = {};

// converts the data string to a JSON object
exports.dataToJSON = function (data) {
    var dataArray = data.split(",");
    for (entry in dataArray) {
        var dataSplit = dataArray[entry].split("|");
        JSONData[dataSplit[0]] = dataSplit[1];
    }
    return JSONData;
};
