var data = require('./data');
var constants = require('./../constants');

function dataGathererService() {
  return new Promise(function(resolve, reject) {
    var randomData = getRandomData();
    var dataForPDF = prepareDataForPDF(randomData);
    resolve(dataForPDF);
  });
}

function getRandomData() {
  var index = Math.floor((Math.random() * data.length));
  return JSON.parse(JSON.stringify(data[index]));
}

function prepareDataForPDF(Data) {
  var dataForPDF = {};

  dataForPDF.KPI1 = Data.KPI1;
  dataForPDF.KPI2 = constants.IMAGE_DIR_URL + Data.KPI1;
  dataForPDF.KPI3 = constants.IMAGE_DIR_URL + Data.KPI3;
  dataForPDF.KPI4 = Data.year;
  dataForPDF.KPI6 = Data.KPI6;
  dataForPDF.KPI7 = Data.KPI7;
  dataForPDF.KPI8 = Data.KPI8;


  return dataForPDF;
}

module.exports = dataGathererService;
