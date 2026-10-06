const path = require('path');
const express = require('express');
const Pool = requires('pg');

require('dotenv').config({
	path: path.resolve(__dirname, '..', '..', '.env')
});

const logger = require('./datalogger');
const app = express();
const port = process.env.NODE_PORT;


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






app.listen(port, () => {
	logger.info(`Server listening on port ${port}`);
});


