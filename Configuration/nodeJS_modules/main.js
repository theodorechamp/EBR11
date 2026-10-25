import express from "express";
import { Pool } from "pg";
import { OPCUAClient, AttributeIds, StatusCode } from "node-opcua";
import { logger } from "./datalogger.js";

//const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const endpointUrl = "opc.tcp://DESKTOP:4334/UA/MyLittleServer";
const client = OPCUAClient.create({ endpointMustExist: false });

await client.withSessionAsync(endpointUrl, async (session) => {
	logger.info('Checking OPCUA session...')
	
	const dataValue = await session.read({
		nodeId: "ns=1;i=1003",
		attributeId: AttributeIds.Value
	});

	console.log(dataValue.statusCode.toString(), dataValue.value.value);

	let i = 85;
	console.log(`i = ${i}`);
	const objects = await session.browse({ includeSubtypes: true,nodeId: `i=${i}`, resultMask: 0x3f }); // ObjectsFolder

	console.log(objects);
	console.table(objects.references.map((ref) => ({
		browseName: `${ref.browseName.namespaceIndex}:${ref.browseName.name}`,
		nodeId: ref.nodeId.toString()
	})));
	
	const deviceName = "ServerDevice";
	const variableName = "ServerHealthCheck";
	const device = objects.references.find(
		(ref) => ref.browseName.name === deviceName
	);

	if (!device) {
		throw new Error(`Device ${deviceName} was not found`);
	}

	const children = await session.browse({ nodeId: device.nodeId });
	console.table(children.references.map((ref) => ({
		browseName: `${ref.browseName.namespaceIndex}:${ref.browseName.name}`,
		nodeId: ref.nodeId.toString()
	})));
	/*
	const children = await session.browse({ nodeId: device.nodeId });
	const variable = children.references.find(
		(ref) => ref.browseName.name === variableName
	);

	if (!variable){
		throw new Error(`Variable ${variableName} was not found`)
	}

	const dataValue = await session.read({
		nodeId: variable.nodeId,
		attributeId: AttributeIds.Value
	});
  /*const dataValue = await session.read({
    browseName: "ServerHealthCheck",
    attributeId: AttributeIds.Value
  }); */
  //console.log("Server time:", dataValue.value.value);

  /*if(dataValue.statusCode.isGood()){

	logger.info('OPCUA session validated.');
	logger.info(`Value pulled: ${dataValue.value.value}`);
  } else{
	logger.error(`OPC UA read failed: ${dataValue.statusCode.toString()}`);
  } */
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


