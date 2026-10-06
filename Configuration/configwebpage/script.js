const NODE_IPADDRESS = "localhost";
const NODE_PORT = 3000;
const URI_GENERATETABLES = "tables"



async function requestGenerateTables(){
    
    const payload = {
        tables : ['batch','bool_parameters','int_parameters','real_parameters','string_parameters']
    };

    try {
        const response = await fetch(`http://${NODE_IPADDRESS}:${NODE_PORT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : payload
        });

        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
    } catch (e) { 
        console.error(`Error sending data: ${e}`);
    }



}


document.getElementById('btnGenerateTables').addEventListener('click', requestGenerateTables);