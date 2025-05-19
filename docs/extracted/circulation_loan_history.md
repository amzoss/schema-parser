---
title: circulation_loan_history
---
## Source:

Module: mod-circulation-storage

Interface: /loan-storage/loan-history

## Attributes:

| Property Name   | Property Type   | Property Description                                                                              |
|:----------------|:----------------|:--------------------------------------------------------------------------------------------------|
| id              | string          | Unique ID (generated UUID) of the snapshot of the loan record                                     |
| operation       | string          | Type of change that triggered this loan record snapshot: I for insert, U for update, D for delete |
| creationDate    | string          | When this snapshot was created                                                                    |
| loan            | object          | The snapshot of the loan record                                                                   |

