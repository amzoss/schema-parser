# FOLIO Schema Parser

This repository contains a back-up of a Google Apps Script used to populate data in a Google Spreadsheet. The purpose is to automate the creation of a lightweight [data dictionary](https://wiki.folio.org/pages/viewpage.action?pageId=36573674) for FOLIO data, including supplemental information about how FOLIO data appear in the [Library Data Platform](https://librarydataplatform.org/).

This script is meant to be attached to a Google Sheet as an Apps Script. The Sheet must also be designed so that the first tab includes descriptive information and links to the FOLIO data documentation that can be parsed by the script. 

## Dependencies
Python 3 is required.

Install required modules through pip:

```
python -m pip install -r requirements.txt
```

## Directories
* ```/data```
  * ```/csv```: Contains a CSV file that outlines information needed to locate RAML data and associate them with the LDP1 and Metadb table information. 
* ```/Output```: Contains the output files. These will be displayed online with GitHub Pages.
* ```/python```
  *  ```extracted_table_docs.py```: The main script, which combines CSV data with public RAML files and generates public documentation of extracted tables.
* ```/javascript```
  *  ```import-folio-raml-data.gs```: The original version of the script, written in Google Apps Script for a Google Sheet.

## Usage

* The Python script is written for Python 3. 
* It may be necessary to install additional modules (see [Dependencies](#Dependencies)). 
* The script depends on having accurate links to RAML documentation in the CSV file.