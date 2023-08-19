---
title: Documentation&#58; <a href='inventory_modes_of_issuance.md'>inventory_modes_of_issuance</a>
---
## Source:

Module: mod-inventory-storage

Interface: /modes-of-issuance

## Attributes:

| Property Name              | Property Type   | Property Description                                                                               |
|:---------------------------|:----------------|:---------------------------------------------------------------------------------------------------|
| id                         | string          |                                                                                                    |
| name                       | string          | label for the mode of issuance                                                                     |
| source                     | string          | label indicating where the mode of issuance entry originates from, i.e. 'rdamodeissue' or 'local'  |
| metadata                   | object          | Metadata about creation and changes to records, provided by the server (client should not provide) |
| metadata/createdDate       | string          | Date and time when the record was created                                                          |
| metadata/createdByUserId   | string          | ID of the user who created the record (when available)                                             |
| metadata/createdByUsername | string          | Username of the user who created the record (when available)                                       |
| metadata/updatedDate       | string          | Date and time when the record was last updated                                                     |
| metadata/updatedByUserId   | string          | ID of the user who last updated the record (when available)                                        |
| metadata/updatedByUsername | string          | Username of the user who last updated the record (when available)                                  |

