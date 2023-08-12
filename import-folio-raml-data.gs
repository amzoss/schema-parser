/*
* This is a script to fetch information about the data elements
* available from different FOLIO APIs. Links to the API schema files,
* published on GitHub, are copied into the first tab of the spreadsheet.
* This script fetches the content from each URL, parses it to extract the
* information about data elements, and builds a second tab in the
* spreadsheet to display that information.
*
* The script runs on a nightly trigger, which is controlled using the 
* "Triggers" feature of the Apps Script development environment.
* It can also be run as needed using a custom menu that this script
* creates within the spreadsheet. 
*/

function onOpen() {

  // This function gets called automatically when the spreadsheet opens.
  // All it does is add a menu called "FOLIO Schema parser" with an
  // option that lets a spreasheet user trigger a refresh of the data.

  // Note: can't run the refresh automatically on load; 
  // have to run from menu or from script editor because of URL fetch in
  // parseRAMLtriggered();

  // As of 2023-08-11, this is not consistently. For some reason, menu
  // sometimes throws an error, even though it works when running from 
  // script editor and trigger.

  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Refresh Data Elements', functionName: 'parseRAMLtriggered'}
  ];
  spreadsheet.addMenu('FOLIO Schema parser', menuItems);

}


function readRAMLInfo() {

  // This function reads the RAML (or schema) information from the first tab of 
  // the spreadsheet and returns that data for additional processing.

  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Add Interfaces');
  sheet.activate();
  
  var data = sheet.getRange(2,1,sheet.getLastRow()-1,6).getValues();

  //console.log(data);
  return data;
}

function parseRAMLtriggered() {

  // This function takes on the bulk of the work to retrieve the 
  // schema information, parse it into a table, and push it to
  // the second tab of the spreadsheet.

  // There are many calls to Logger.log() to keep track of the 
  // progress of the script. Just open the "Execution log" to 
  // see the messages.


  // First, grab the data from the first tab of the spreadsheet
  // and store it in a variable called "rows".
  Logger.log("starting the parse");
  var rows = readRAMLInfo()
  
  Logger.log(rows.length);
  
  // Open the second tab of the spreadsheet and clear any existing data.
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Review Data Elements');
  
  sheet.clear().clearNotes();

  // Set up the headers for the second tab of the spreadsheet
  var headers = [
    'Module Name',
    'Interface Name\n(mouse-over in green row\nfor an example record)',
    'LDP Table Name',
    'Property Name',
    'Property Type',
    'Property Description'];
  
  sheet.getRange('A1:F1').setValues([headers]).setFontWeight('bold');
  
  // Create placeholder variables that will be filled by the various
  // loops and parsing functions.
  var newRows = [];
  var modName = '';
  var intName = '';
  var ldpName = '';
  var ramlURL = '';
  var exampleURL = '';
  var oneRAML = {};
  var examples = {};
  var urlLookup = {};
  
  // Call the grabERMdocs() function to pull data for ERM tables using
  // a different method. Store the results in a variable called ermProps.
  var ermProps = grabERMdocs();
   
  // Loop through each schema from the first tab of the spreadsheet.
  for (var i = 0; i < rows.length; i++) {
    
    Logger.log("starting RAML loop: " + i);
    
    // For each row, save the data from each column
    modName = rows[i][0];
    console.log(modName);
    intName = rows[i][1];
    console.log(intName);
    ldpName = rows[i][2];
    console.log(ldpName);
    ramlURL = rows[i][3];
    console.log(ramlURL);
    exampleURL = rows[i][4];
    console.log(exampleURL);
    
    var apiUrl = rows[i][5];
    urlLookup[intName] = apiUrl;
    
    //console.log(urlLookup);
  
    // if there is a row without a ramlURL, just skip it entirely
    if (ramlURL != '') {

      // if there is a row without an example URL, just leave that blank
      var exampleJson = '';

      if (exampleURL != '') {

        var exampleResponse = UrlFetchApp.fetch(exampleURL, {'muteHttpExceptions': true});

        var exampleJson = exampleResponse.getContentText();

      }
    
      examples[ldpName] = exampleJson; 
      
      // Extract the properties from the RAML URL with a separate function and save
      // to a variable named "oneRAML". The properties will be in the form of a JSON object.
      console.log("getting props");
      oneRAML = getAllProps(ramlURL);
      
      // Start building an array to store the properties in tabular form. This will
      // be an array of arrays, which is what is required to fill data into the second 
      // tab of the Google Sheet. The first element added to the array is a subheading 
      // row, which presents basic table info from the first spreadsheet tab. 
      var propArray = new Array(1);
      
      propArray[0] = [modName, intName, ldpName, '', '', ''];
      
      // Call the propsToRows() function, which takes some of the information
      // from the first tab and the JSON object containing the properties and
      // returns the parsed data in an array of arrays.
      var propRows = propsToRows(modName, intName, ldpName, oneRAML, '');
      
      // Add the tabular form of the properties to the same array with the subheading.
      propArray = propArray.concat(propRows);
      
      // Add the combined array of arrays to the growing array that stores the data from 
      // all of the various RAMLs.
      newRows = newRows.concat(propArray);
      
      Logger.log("ending RAML loop " + i + " with newRows of length " + newRows.length);

      }
    else if (modName == 'mod_agreements') {

      // mod_agreements is different, so even though it doesn't have a URL, still look for data  
    
      // for each interface row, want to add a header to newRows,
      // pull out all the data rows from the TSV,
      // add those rows after header to newRows array
      
      // so, ermProps should be a dict where you can lookup all data rows
      // for an interface at once, but then rows should already be formatted for 
      // newRows
      
      newRows = newRows.concat([[modName, intName, ldpName, '', '', '']]);
  
      var ermLookup = modName + '.' + intName;
      
      var newERMRows = ermProps[ermLookup];
      
      var rowsAfterAppend = new Array(1);
      
      for (var r=0; r<newERMRows.length; r++) {
        newRows = newRows.concat([[modName, intName, ldpName, newERMRows[r][1], '', newERMRows[r][2]]]);
      }
    }
  }

  // After going through all of the rows from tab 1, add values to tab 2
  
  // Starting with row 2 of tab 2, add in the full set of new rows, and give it some styling
  var valuesRange = sheet.getRange(2,1,newRows.length,6);
  valuesRange.setValues(newRows).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
    
  // add styling to subheading rows
  for (var x = 0; x < newRows.length; x++) {
    if (newRows[x][3] == '') {
      //Logger.log("Adding styling to subheader row: " + newRows[x][2]);
      var exJson = examples[newRows[x][2]]; // look up LDP table name in examples dict
      var cellVal = sheet.getRange(x+2,2).getValue(); // get interface name from spreadsheet
      var cellUrl = urlLookup[cellVal]; // look up API docs URL from interface name
      console.log(cellVal + ',' + cellUrl);
      // add link and note to the cell with the interface name
      sheet.getRange(x+2,2).setFormula('=HYPERLINK("'+cellUrl+'","'+cellVal+'")').setNote(exJson); 
      // make the text for the whole row bold
      sheet.getRange(x+2,1,1,6).setFontWeight('bold').setBackground('#ccffcc');
    }

  }
  
  // set other sheet properties like column width and frozen rows
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 5);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(6, 600);
  
}

//TO DO: would be good to catch an exception for JSON.parse,
//but should it happen in this function? where this function
//gets called? both? maybe this doesn't need to be a function?
function getAllProps(ramlURL) {

  // fetch the RAML data from the URL, parse it as JSON, then
  // extract and return the "properties" object

  var url = ramlURL;
  console.log("fetching URL: " + url);
  
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  //Logger.log(response);
  
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data);
  
  var props = data["properties"];
  return props;
   
}


function propsToRows(modName, intName, ldpName, props, prefix) {

  // The JSON properties object is passed into this function, along with
  // other table information and an optional prefix. This function is
  // recursive, which means that nested properties can be parsed by 
  // calling the function from inside the function. The "prefix" argument
  // is used during recursion to keep track of what level the parser
  // is at.
  
  console.log("propsToRows: " + ldpName + ", " + prefix);

    // Find all of the names of properties at this level of the object
    var propKeys = Object.keys(props);
    //console.log(propKeys);
  
    // Find the values of all of the properties (should be an object with
    // keys like "type" and "description")
    var propValues = Object.values(props)
    //console.log(propValues);
    
    // calculate the number of properties
    var numProps = propKeys.length;
    //console.log(numProps);
    
    // create an array to store a row for each property
    var propArray = new Array();
    
    // iterate through the properties
    for (var j = 0; j < numProps; j++) {

      var propName = propKeys[j];
      
      // if this is a nested property, add the prefix to the name of the property
      if (prefix != '') {
        propName = prefix + '/' + propName;
      } 

      var propValue = propValues[j];

      // build an array for the spreadsheet row, combining tab 1 info with the name, 
      // type, and description of the current property. add this row to the storage array.
      var newRow = [[modName, intName, ldpName, propName, propValue["type"], propValue["description"]]];
      //console.log(newRow);
      propArray = propArray.concat(newRow);
      
      // after creating a row for the property, check if it's an object or an array of objects.

      // for objects, find the nested properties object and start the process over again. The
      // result of that will be another array of arrays. Add that into the storage array, 
      // just like the top-level properties.
      // Note: not all objects have a nested properties object in these RAML files. The
      // object may reference another schema. In the API documentation, those references
      // are filled in and you see the nested properties, but in the source data on GitHub,
      // there might just be a reference.

      if (propValue["type"] == "object") {
        var newProps = propValue["properties"];
        //console.log(newProps);
        if (newProps) {
          var newPropArray = propsToRows(modName, intName, ldpName, newProps, propName);
          propArray = propArray.concat(newPropArray);
        }
      } else if (propValue["type"] == "array" ) {

        // For arrays, look for a key named "items", and then look for "properties" in that key.
        // If you find another properties object, start the parsing over again. The
        // result of that will be another array of arrays. Add that into the storage array, 
        // just like the top-level properties.

        //console.log("propName: " + propName + "\npropValue Type: " + propValue["type"] + "\npropValue items: " + propValue["items"]);
        //console.log("has properties? " + propValue.hasOwnProperty('items'));
        if ('items' in propValue) {
          if ('properties' in propValue["items"]) {
            var itemProps = propValue["items"]["properties"];
            var newPropArray = propsToRows(modName, intName, ldpName, itemProps, propName);
            propArray = propArray.concat(newPropArray);
          }
        }
      }
    }
  // After all of the loops are done, return the full array of arrays, which contain
  // all of the parse-able properties in individual rows.
  return propArray;
}

function grabERMdocs(){

  // A special .tsv file was created to descript the ERM tables. Parse it into a dict
  // that can be used to look up the correct row information for each interface.

  var ERMurl = 'https://raw.githubusercontent.com/folio-org/ldp-erm-doc/master/erm-reporting-data-dictionary.tsv';
  var allText = UrlFetchApp.fetch(ERMurl, {'muteHttpExceptions': true}).getContentText();
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(/\t/);
  var rowsByInterface = {};

  for (var i=1; i<allTextLines.length; i++) {
    //console.log('Row number: ' + i);
    var data = allTextLines[i].split(/\t/);
    var row = [data[0],data[1],data[2]];
    if (data[0] != '') {
      if (!(data[0] in rowsByInterface)) {
        rowsByInterface[data[0]] = [row];
      }
      else {
        var prevVal = rowsByInterface[data[0]];
        rowsByInterface[data[0]] = prevVal.concat([row]);
      }
    }
  }
  //console.log(rowsByInterface);
  return rowsByInterface;
}
