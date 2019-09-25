"use strict";

module.exports = {

    metadata: () => ({
        "name": "exportDataSlice",
        "properties": {
            "year": { "type": "string", "required": false }
            },
        "supportedActions": ["success"]
    }),

    invoke: (conversation, done) => {

      //currency formatter function
        let formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          // the default value for minimumFractionDigits depends on the currency
          // and is usually already 2
          });

      const year = conversation.properties().year;

      let body =
        {
           "exportPlanningData":false,
           "gridDefinition":{
              "suppressMissingBlocks":true,
              "pov":{
                 "dimensions":[
                    "Period",
                    "Version",
                    "Entity",
                    "Year",
                    "Scenario"
                 ],
                 "members":[
                    [
                       "BegBalance"
                    ],
                    [
                       "Final"
                    ],
                    [
                       "Total_University"
                    ],
                    [
                       year
                    ],
                    [
                       "Actual"
                    ]
                 ]
              },
              "columns":[
                 {
                    "dimensions":[
                       "Account"
                    ],
                    "members":[
                       [
                          "State Govt Appropriations Operating"
                       ]
                    ]
                 }
              ],
              "rows":[
                 {
                    "dimensions":[
                       "Program"
                    ],
                    "members":[
                       [
                          "No Enrollment Type"
                       ]
                    ]
                 }
              ]
           }
      };

     var mobileSdk = conversation.oracleMobile;

      mobileSdk.connectors.post('EPM1082','exportdataslice',body,{inType: 'json', versionToInvoke: '1.0'}).then(
      function(result){
      console.log(result.result);
      var obj = JSON.parse(result.result);
      var slice = obj.rows[0].data[0];

      conversation.variable("slice", formatter.format(parseInt(slice)));
      conversation.transition("success");
      console.log("this is my object from 1082");
      console.log(obj);
      done();

          }
      ).catch(

      function(error){
          console.log(error);
          conversation.reply({ text: message});
          conversation.transition();
          done();
      }
      );


    }
};
