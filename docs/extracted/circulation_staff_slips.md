---
title: circulation_staff_slips
---
## Source:

Module: mod-circulation-storage

Interface: /staff-slips-storage/staff-slips

## Attributes:

| Property Name              | Property Type   | Property Description                                                                                                                                                                                     |
|:---------------------------|:----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                         | string          |                                                                                                                                                                                                          |
| name                       | string          | Staff slip name                                                                                                                                                                                          |
| description                | string          | Staff slip description                                                                                                                                                                                   |
| active                     | boolean         | Flag that indicates whether staff slip is active                                                                                                                                                         |
| isRawHtml                  | boolean         | Flag that indicates whether staff slip should be maintained as raw HTML rather than using the WYSIWYG editor. This has no implications for the back-end code, as is merely a note from the UI to itself. |
| template                   | string          | Staff slip template                                                                                                                                                                                      |
| metadata                   | object          | Metadata about creation and changes to records, provided by the server (client should not provide)                                                                                                       |
| metadata/createdDate       | string          | Date and time when the record was created                                                                                                                                                                |
| metadata/createdByUserId   | string          | ID of the user who created the record (when available)                                                                                                                                                   |
| metadata/createdByUsername | string          | Username of the user who created the record (when available)                                                                                                                                             |
| metadata/updatedDate       | string          | Date and time when the record was last updated                                                                                                                                                           |
| metadata/updatedByUserId   | string          | ID of the user who last updated the record (when available)                                                                                                                                              |
| metadata/updatedByUsername | string          | Username of the user who last updated the record (when available)                                                                                                                                        |

