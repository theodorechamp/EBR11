import express from "express";
import { Pool } from "pg";
import { OPCUAClient, AttributeIds } from "node-opcua";
import { logger } from "./datalogger.js";

const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";

const client = OPCUAClient.create({ endpointMustExist: false });

await client.withSessionAsync(endpointUrl, async (session) => {
	logger.info('Checking OPCUA session...')	
  const dataValue = await session.read({
    nodeId: "ns=0;i=2258", // Server CurrentTime
    attributeId: AttributeIds.Value,
  });
  //console.log("Server time:", dataValue.value.value);

  if(dataValue.value.value){
	logger.info('OPCUA session validated.')
  }
});

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

async function checkServerHealth(){
	try {
		const client = await pool.connect();
		await client.query('SELECT 1');
		await client.release();
		logger.info('PostgreSQL Server responded normal');
		return true;
	} catch (error) {
		logger.error('Health check failed', { message: error.message });
		return false;
	}
}

app.get('/api/v1/health', async (req, res) => {
	if (await checkServerHealth()){
		res.status(200);
	} else {
		res.status(500);
	}
});


if(process.env.AUTOCHECK_SQLHEALTH){
	logger.info('Autochecking health of SQL server connection (To disable set AUTOCHECK_SQLHEALTH flag false)');
	checkServerHealth();
}


// ###########################
// #### Listening on Port ####
// ###########################

app.listen(port, () => {
	logger.info(`Server listening on ${process.env.PGHOST}:${port}`);
});


