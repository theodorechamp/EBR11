import { OPCUAServer, Variant, DataType, StatusCodes} from "node-opcua";
import { logger } from "./datalogger.js";


const server = new OPCUAServer({
    port: 4334, //listening port, move to .env
    resourcePath: "/UA/MyLittleServer"
});

await server.initialize();
logger.info("Server has been initialized");

const addressSpace = server.engine.addressSpace;
const namespace = addressSpace.getOwnNamespace();

const device = namespace.addObject({
   organizedBy: addressSpace.rootFolder.objects,
   browseName: "MyDevice" 
});

let variable1 = 1;

// emulate variable1 changing every 500 ms
setInterval(() => {  variable1+=1; }, 500);

namespace.addVariable({
    componentOf: device,
    browseName: "MyVariable1",
    dataType: "Double",
    minimumSamplingInterval: 1000,
    value: {
        get:  () => new Variant({dataType: DataType.Double, value: variable1 })
    }
});

let variable2 = 10.0;

namespace.addVariable({
    componentOf: device,
    nodeId: "ns=1;b=1020FFAA",
    browseName: "MyVariable2",
    dataType: "Double",
    minimumSamplingInterval: 1234,
    value: {
        get: () => new Variant({dataType: DataType.Double, value: variable2}),
        set: (variant) => {
            variable2 = parseFloat(variant.value);
            return StatusCodes.Good;
        }
    }
})

import os from "os";

/**
 * returns the percentage of free memory on the running machine
 * @return {double}
 */
function available_memory() {
    // var value = process.memoryUsage().heapUsed / 1000000;
    const percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
    return percentageMemUsed;
}

namespace.addVariable({

    componentOf: device,

    nodeId: "s=free_memory", // a string nodeID
    browseName: "FreeMemory",
    dataType: "Double",
    minimumSamplingInterval: 1000,    
    value: {
        get:  () => new Variant({dataType: DataType.Double, value: available_memory() })
    }
});

server.start(function() {
    logger.info("Server is now listening... (Press Ctrl+C to stop)");
    logger.info(`Port ${server.endpoints[0].port}`);
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    logger.info(`The primary server endpoint url is ${endpointUrl}`);
});
