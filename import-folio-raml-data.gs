function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Refresh Data Elements', functionName: 'parseRAMLtriggered'}
  ];
  spreadsheet.addMenu('FOLIO Schema parser', menuItems);

  //Note: can't run the refresh automatically on load; 
  //have to run from menu or from script editor because of URL fetch
  //parseRAMLtriggered();
}


function readRAMLInfo() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Add Interfaces');
  sheet.activate();
  
  var data = sheet.getRange(2,1,sheet.getLastRow()-1,6).getValues();

  //console.log(data);
  return data;
}

function parseRAMLtriggered() {
  Logger.log("starting the parse");
  var rows = readRAMLInfo()
  
  Logger.log(rows.length);
  
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Review Data Elements');
  
  //spreadsheet.deleteSheet(sheet);
  //spreadsheet.insertSheet('Review Data Elements');
  // add a delay here; was getting timeout errors trying to get the sheet,
  // so thought it might be the time it takes to create the sheet
  //Utilities.sleep(2000);
  //var sheet = spreadsheet.getSheetByName('Review Data Elements');
  
  sheet.clear();

  var headers = [
    'Module Name',
    'Interface Name\n(mouse-over in green row\nfor an example record)',
    'LDP Table Name',
    'Property Name',
    'Property Type',
    'Property Description',
    'Connects to (table:field)'];
  sheet.getRange('A1:G1').setValues([headers]).setFontWeight('bold');
  
  var newRows = [];
  var modName = '';
  var intName = '';
  var ldpName = '';
  var ramlURL = '';
  var exampleURL = '';
  var oneRAML = {};
  var examples = {};
  var urlLookup = {};
  
  var ermProps = grabERMdocs();
   
  //loop through each RAML
  for (var i = 0; i < rows.length; i++) {
    
    Logger.log("starting RAML loop: " + i);
    
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
  
    if (ramlURL != '') {
    
      var exampleResponse = UrlFetchApp.fetch(exampleURL, {'muteHttpExceptions': true});

      var exampleJson = exampleResponse.getContentText();
      
      examples[ldpName] = exampleJson; 
      
      console.log("getting props");
      oneRAML = getAllProps(ramlURL);
      
      var propArray = new Array(1);
      
      propArray[0] = [modName, intName, ldpName, '', '', ''];
      
      var propRows = propsToRows(modName, intName, ldpName, oneRAML, '');
      
      propArray = propArray.concat(propRows);
      
      newRows = newRows.concat(propArray);
      
      Logger.log("ending RAML loop " + i + " with newRows of length " + newRows.length);

      }
    else if (modName == 'mod_agreements') {
      // for each interface row, want to add a header to newRows,
      // pull out all the data rows from the TSV,
      // add those rows after header to newRows array
      
      // so, grabERMdocs() should return a dict where you can lookup all data rows
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
    
  // add values to spreadsheet
  
  var valuesRange = sheet.getRange(2,1,newRows.length,6);
  valuesRange.setValues(newRows).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  
  // add vlookup
  var extraColumn = sheet.getRange(2, 7, newRows.length, 1);
  extraColumn.setFormulaR1C1('=IFNA(VLOOKUP(R[0]C[-3],ForeignKeys,4,false),"")');
  
  
  // add styling to generic table rows
  for (var x = 0; x < newRows.length; x++) {
    if (newRows[x][3] == '') {
      var exJson = examples[newRows[x][2]];
      var cellVal = sheet.getRange(x+2,2).getValue();
      var cellUrl = urlLookup[cellVal];
      console.log(cellVal + ',' + cellUrl);
      sheet.getRange(x+2,2).setFormula('=HYPERLINK("'+cellUrl+'","'+cellVal+'")').setNote(exJson);
      sheet.getRange(x+2,1,1,7).setFontWeight('bold').setBackground('#ccffcc');
    }

  }
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 5);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(6, 300);
  sheet.setColumnWidth(7, 200);
  
}

//TO DO: would be good to catch an exception for JSON.parse,
//but should it happen in this function? where this function
//gets called? both? maybe this doesn't need to be a function?
function getAllProps(ramlURL) {
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
  
  console.log("propsToRows: " + ldpName + ", " + prefix);
    var propKeys = Object.keys(props);
    //console.log(propKeys);
  
    var propValues = Object.values(props)
    //console.log(propValues);
    
    var numProps = propKeys.length;
    //console.log(numProps);
    
    var propArray = new Array();
    
    for (var j = 0; j < numProps; j++) {
      var propName = propKeys[j];
      if (prefix != '') {
        propName = prefix + '/' + propName;
      } 
      var propValue = propValues[j];
      var newRow = [[modName, intName, ldpName, propName, propValue["type"], propValue["description"]]];
      //console.log(newRow);
      propArray = propArray.concat(newRow);
      
      if (propValue["type"] == "object") {
        var newProps = propValue["properties"];
        console.log(newProps);
        if (newProps) {
          var newPropArray = propsToRows(modName, intName, ldpName, newProps, propName);
          propArray = propArray.concat(newPropArray);
        }
      } else if (propValue["type"] == "array" ) {
        console.log("propName: " + propName + "\npropValue Type: " + propValue["type"] + "\npropValue items: " + propValue["items"]);
        console.log("has properties? " + propValue.hasOwnProperty('items'));
        if ('items' in propValue) {
          if ('properties' in propValue["items"]) {
            var itemProps = propValue["items"]["properties"];
            var newPropArray = propsToRows(modName, intName, ldpName, itemProps, propName);
            propArray = propArray.concat(newPropArray);
          }
        }
      }
    }
  return propArray;
}

function grabERMdocs(){
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
