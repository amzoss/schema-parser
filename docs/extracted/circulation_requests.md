---
title: circulation_requests
---
# Documentation: [circulation_requests](circulation_requests.md)

## Source:

Module: mod-circulation-storage

Interface: /request-storage/requests

## Attributes:

| Property Name                               | Property Type   | Property Description                                                                                                                                                                                                                                     |
|:--------------------------------------------|:----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                          | string          | UUID of the request                                                                                                                                                                                                                                      |
| requestLevel                                | string          | Level of the request - Item or Title                                                                                                                                                                                                                     |
| requestType                                 | string          | Whether the item should be held upon return, recalled or paged for                                                                                                                                                                                       |
| requestDate                                 | string          | Date the request was made                                                                                                                                                                                                                                |
| patronComments                              | string          | Comments made by the patron                                                                                                                                                                                                                              |
| requesterId                                 | string          | ID of the requesting patron (user)                                                                                                                                                                                                                       |
| proxyUserId                                 | string          | ID of the user representing a proxy for the patron                                                                                                                                                                                                       |
| instanceId                                  | string          | A universally unique identifier (UUID), this is a 128-bit number used to identify a record and is shown in hex with dashes, for example 6312d172-f0cf-40f6-b27d-9fa8feaf332f; the UUID version must be from 1-5; see https://dev.folio.org/guides/uuids/ |
| holdingsRecordId                            | string          | A universally unique identifier (UUID), this is a 128-bit number used to identify a record and is shown in hex with dashes, for example 6312d172-f0cf-40f6-b27d-9fa8feaf332f; the UUID version must be from 1-5; see https://dev.folio.org/guides/uuids/ |
| itemId                                      | string          | ID of the item being requested                                                                                                                                                                                                                           |
| status                                      | string          | Status of the request                                                                                                                                                                                                                                    |
| cancellationReasonId                        | string          | The id of the relevant request reason                                                                                                                                                                                                                    |
| cancelledByUserId                           | string          | The id of the user that cancelled the request                                                                                                                                                                                                            |
| cancellationAdditionalInformation           | string          | Potential relevant information regarding a cancellation                                                                                                                                                                                                  |
| cancelledDate                               | string          | Date the request was cancelled                                                                                                                                                                                                                           |
| position                                    | integer         | Position of the request in the unified request queue                                                                                                                                                                                                     |
| instance                                    | object          | Copy of some instance metadata (used for searching and sorting)                                                                                                                                                                                          |
| instance/title                              | string          | title of the item                                                                                                                                                                                                                                        |
| instance/identifiers                        | array           | An extensible set of name-value pairs of identifiers associated with the resource                                                                                                                                                                        |
| instance/identifiers/value                  | string          | Resource identifier value                                                                                                                                                                                                                                |
| instance/identifiers/identifierTypeId       | string          | A universally unique identifier (UUID), this is a 128-bit number used to identify a record and is shown in hex with dashes, for example 6312d172-f0cf-40f6-b27d-9fa8feaf332f; the UUID version must be from 1-5; see https://dev.folio.org/guides/uuids/ |
| item                                        | object          | Copy of some item metadata (used for searching and sorting)                                                                                                                                                                                              |
| item/barcode                                | string          | barcode of the item                                                                                                                                                                                                                                      |
| requester                                   | object          | Copy of some requesting patron metadata (used for searching and sorting)                                                                                                                                                                                 |
| requester/firstName                         | string          | first name of the requesting patron                                                                                                                                                                                                                      |
| requester/lastName                          | string          | last name of the requesting patron                                                                                                                                                                                                                       |
| requester/middleName                        | string          | middle name of the requesting patron                                                                                                                                                                                                                     |
| requester/barcode                           | string          | barcode of the requesting patron                                                                                                                                                                                                                         |
| requester/patronGroup                       | string          | DEPRECATED, to be removed in subsequent major version                                                                                                                                                                                                    |
| proxy                                       | object          | Copy of some proxy patron metadata (used for searching and sorting)                                                                                                                                                                                      |
| proxy/firstName                             | string          | first name of the proxy patron                                                                                                                                                                                                                           |
| proxy/lastName                              | string          | last name of the proxy patron                                                                                                                                                                                                                            |
| proxy/middleName                            | string          | middle name of the proxy patron                                                                                                                                                                                                                          |
| proxy/barcode                               | string          | barcode of the proxy patron                                                                                                                                                                                                                              |
| proxy/patronGroup                           | string          | DEPRECATED, to be removed in subsequent major version                                                                                                                                                                                                    |
| fulfillmentPreference                       | string          | How should the request be fulfilled (whether the item should be kept on the hold shelf for collection or delivered to the requester)                                                                                                                     |
| deliveryAddressTypeId                       | string          | Deliver to the address of this type, for the requesting patron                                                                                                                                                                                           |
| requestExpirationDate                       | string          | Date when the request expires                                                                                                                                                                                                                            |
| holdShelfExpirationDate                     | string          | Date when an item returned to the hold shelf expires                                                                                                                                                                                                     |
| pickupServicePointId                        | string          | The ID of the Service Point where this request can be picked up                                                                                                                                                                                          |
| metadata                                    | object          | Metadata about creation and changes to records, provided by the server (client should not provide)                                                                                                                                                       |
| metadata/createdDate                        | string          | Date and time when the record was created                                                                                                                                                                                                                |
| metadata/createdByUserId                    | string          | ID of the user who created the record (when available)                                                                                                                                                                                                   |
| metadata/createdByUsername                  | string          | Username of the user who created the record (when available)                                                                                                                                                                                             |
| metadata/updatedDate                        | string          | Date and time when the record was last updated                                                                                                                                                                                                           |
| metadata/updatedByUserId                    | string          | ID of the user who last updated the record (when available)                                                                                                                                                                                              |
| metadata/updatedByUsername                  | string          | Username of the user who last updated the record (when available)                                                                                                                                                                                        |
| tags                                        | object          | List of simple tags that can be added to an object                                                                                                                                                                                                       |
| tags/tagList                                | array           | List of tags                                                                                                                                                                                                                                             |
| awaitingPickupRequestClosedDate             | string          | A date when the request with awaiting pickup status was closed                                                                                                                                                                                           |
| searchIndex                                 | object          | Request fields used for search                                                                                                                                                                                                                           |
| searchIndex/callNumberComponents            | object          | Effective call number components                                                                                                                                                                                                                         |
| searchIndex/callNumberComponents/callNumber | string          | Effective Call Number is an identifier assigned to an item or its holding and associated with the item.                                                                                                                                                  |
| searchIndex/callNumberComponents/prefix     | string          | Effective Call Number Prefix is the prefix of the identifier assigned to an item or its holding and associated with the item.                                                                                                                            |
| searchIndex/callNumberComponents/suffix     | string          | Effective Call Number Suffix is the suffix of the identifier assigned to an item or its holding and associated with the item.                                                                                                                            |
| searchIndex/shelvingOrder                   | string          | A system generated normalization of the call number that allows for call number sorting in reports and search results                                                                                                                                    |
| searchIndex/pickupServicePointName          | string          | The name of the request pickup service point                                                                                                                                                                                                             |
