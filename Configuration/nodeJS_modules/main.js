const express = require('express');
const { Pool } = require('pg');

import { OPCUAClient, AttributeIds } from "node-opcua";

const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";

const client = OPCUAClient.create({ endpointMustExist: false });

await client.withSessionAsync(endpointUrl, async (session) => {
  const dataValue = await session.read({
    nodeId: "ns=0;i=2258", // Server CurrentTime
    attributeId: AttributeIds.Value,
  });
  console.log("Server time:", dataValue.value.value);
});

require('dotenv').config({
	path: path.resolve(__dirname, '..', '..', '.env')
});

const logger = require('./datalogger');
const app = express();
const port = process.env.NODE_PORT;

// #####################################
// ### PostgreSQL Pool Configuration ###
// #####################################

const pool = new Pool({
	host: process.env.PGHOST,
	port: Number(process.env.PGPORT),
	database: process.env.PGDATABASE,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD
});

pool.on('error', (error) => {
	logger.error('Unexpected PostgreSQL pool error', { message: error.message });
});

app.get('/api/v1/health', async (req, res) => {
	try {
		const client = await pool.connect();
		await client.query('SELECT 1');
		await client.release();
		res.status(200).json({ status: 'OK' });
	} catch (error) {
		logger.error('Health check failed', { message: error.message });
		res.status(500).json({ status: 'Error' });
	}
});

app.listen(port, () => {
	logger.info(`Server listening on port ${port}`);
});


