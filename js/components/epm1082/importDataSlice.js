"use strict";

module.exports = {

  metadata: () => ({
    "name": "importDataSlice",
    "properties": {
      "year": {
        "type": "string",
        "required": false
      },
      "amount": {
        "type": "string",
        "required": false
      }
    },
    "supportedActions": ["success"]
  }),

  invoke: (conversation, done) => {

    let converter = require('number-to-words');

    //currency formatter function
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      // the default value for minimumFractionDigits depends on the currency
      // and is usually already 2
    });

    const year = conversation.properties().year;
    const amount = conversation.properties().amount;


    let body = {

      "aggregateEssbaseData": false,
      "cellNotesOption": "Overwrite",
      "dateFormat": "DD/MM/YYYY",
      "dataGrid": {
        "pov": [
          "BegBalance", "Baseline", "Total_University", year, "Working Budget"
        ],
        "columns": [
          ["No Enrollment Type"]
        ],
        "rows": [
          {
            "headers": ["State Appropriations"],
            "data": [amount]
          }
        ]
      }
    };

    var mobileSdk = conversation.oracleMobile;

    mobileSdk.connectors.post('EPM1082', 'importdataslice', body, {
      inType: 'json',
      versionToInvoke: '1.0'
    }).then(function(result) {
      console.log(result.result);
      let obj = JSON.parse(result.result);
      console.log(obj);
      let numAcceptedCells = obj.numAcceptedCells;
      let acceptedCells = converter.toWords(numAcceptedCells);
      let modifier;

      switch (numAcceptedCells !== 1) {
        case true:
          modifier = 'amounts have';
          break;

        case false:
          modifier = 'amount has';
          break;
      }


      conversation.variable("acceptedCells", acceptedCells);
      conversation.variable("modifier", modifier);
      conversation.transition("success");
      done();

    }).catch(function(error) {
      console.log(error);
      conversation.reply({text: message});
      conversation.transition();
      done();
    });

  }
};
