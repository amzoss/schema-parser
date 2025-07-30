---
title: inventory_items
---
## Source:

Module: mod-inventory-storage

Interface: /item-storage/items

## Attributes:

| Property Name                       | Property Type   | Property Description                                                                                                                |
|:------------------------------------|:----------------|:------------------------------------------------------------------------------------------------------------------------------------|
| items                               | array           | List of item records                                                                                                                |
| totalRecords                        | integer         | Estimated or exact total number of records                                                                                          |
| resultInfo                          | object          | Faceting of result sets                                                                                                             |
| resultInfo/totalRecords             | integer         | Estimated or exact total number of records. For details see https://github.com/folio-org/raml-module-builder#estimated-totalrecords |
| resultInfo/totalRecordsEstimated    | boolean         | True if totalRecords is an estimation, false if it is the exact number                                                              |
| resultInfo/totalRecordsRounded      | integer         | The rounded value of totalRecords if totalRecords is an estimation                                                                  |
| resultInfo/responseTime             | number          | Response time                                                                                                                       |
| resultInfo/facets                   | array           | Array of facets                                                                                                                     |
| resultInfo/facets/facetValues       | array           | Array of facet values                                                                                                               |
| resultInfo/facets/facetValues/count | integer         | Count of facet values                                                                                                               |
| resultInfo/facets/facetValues/value |                 | Value Object                                                                                                                        |
| resultInfo/facets/type              | string          | Type of facet                                                                                                                       |
| resultInfo/diagnostics              | array           | Array of diagnostic information                                                                                                     |
| resultInfo/diagnostics/source       | string          | Source reporting the diagnostic information                                                                                         |
| resultInfo/diagnostics/code         | string          | Diagnostic Code                                                                                                                     |
| resultInfo/diagnostics/message      | string          | Diagnostic Message                                                                                                                  |
| resultInfo/diagnostics/module       | string          | Module reporting diagnostic information                                                                                             |
| resultInfo/diagnostics/recordCount  | integer         | Record Count for diagnostics                                                                                                        |
| resultInfo/diagnostics/query        | string          | CQL Query associated with results                                                                                                   |

