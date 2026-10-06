# EBR11

## Overview

 EBR11 translates information coming from a PLC to an electronic batch record (EBR) that is 21 CFR Part11 compliant. It does this by watching OPC UA tags on the PLC to record data into a PostgreSQL database, then when a trigger tag (batch_complete) is given rising edge, the data is read back out of the server via the PDF pipeline.

## Requirements
- [NodeJS](https://nodejs.org/en)
    - It is recommended currently install NodeJS with NPM. 
- [PostgreSQL (v18.6-5 or greater)](https://www.postgresql.org/) 
    - PostgreSQL must be running on a computer connected to the NodeJS manager. This can be a local instance running directly on the computer or on a networked server.
    - Take note of the servers ip address if using along with the port that PostgreSQL is running on.
- [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) running on PLC or microcontroller on equipment
    - OPC UA operation and installation varies by PLC or microcontroller manufacturer. Please see manufacturer documentation to ensure that OPC UA is an option and how install and operate.

## Core architecture

PLC -> Published data via OPC UA -> NodeJS instance watches tags and send data to SQL database

OPC Write trigger -> NodeJS requests data and creates a PDF from data

## Phases of operation

### Configuratioon Phase

In this phase, 3 major parts are configured: OPC UA tags are declared, the PostgreSQL server is configured with the appropriate tables created, and the resulting Electronic Batch Record (EBR) is formatted, with an example EBR to be generated.

Currently all configuration happens via configuration files and the user responsible for ensuring that this configuration happens correctly. In the future, ideally there would be several user dialogs to set this up


## Configuration

### Required Tags

There are only a few required tags, they are mostly "trigger" tags. Trigger tags are special tags that are all boolean tags that when a rising edge is detected the system takes an action.

#### Required Tags:

- start_batch (Boolean)
- end_batch (Boolean)

### Custom Tags






