(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "sex",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "areaname",
            alias: "areaname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "areacode",
            alias: "areacode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "pamount",
            alias: "medianpay",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "paygapData",
            alias: "Pay gap between genders by lower tier authority",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://ons.publishmydata.com/sparql.json?query=PREFIX%20qb%3A%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT%20%3Fareacode%20%3Fareaname%20%3Fsexname%20%3Fvalue%20WHERE%20%7B%0A%3Fs%20qb%3AdataSet%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdata%2Fannual-survey-of-hours-and-earnings-2016-earnings%3E%20%3B%0A%20%20%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fmeasure-properties%2Fvalue%3E%20%3Fvalue%20%3B%0A%20%20%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fdimension%2Fearnings%3E%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fconcept%2Fearnings%2Fannual-pay-gross%3E%3B%0A%20%20%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E%20%3Farea%3B%0A%20%20%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fdimension%2FearningsStatistics%3E%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fconcept%2Fearnings-statistics%2Fmedian%3E%3B%0A%20%20%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23sex%3E%20%3Fsex%3B%0A%20%20%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fdimension%2FworkingPattern%3E%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fconcept%2Fworking-pattern%2Ffull-time%3E%20.%0A%20%20%3Farea%20%3Chttp%3A%2F%2Fstatistics.data.gov.uk%2Fdef%2Fstatistical-geography%23officialname%3E%20%3Fareaname%20.%0A%20%20%3Fsex%20rdfs%3Alabel%20%3Fsexname%20.%0A%20%20%3Farea%20rdfs%3Alabel%20%3Fareacode%20.%0A%7D", function(resp) {
            var data = resp.results.bindings,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = data.length; i < len; i++) {
                tableData.push({
                    "sex": data[i].sexname.value,
                    "areaname": data[i].areaname.value,
                    "areacode": data[i].areacode.value,
                    "pamount": data[i].value.value
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ONS Paygap Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
