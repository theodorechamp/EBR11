import Pool from 'pg';
import queue from 'yocto-queue';

type query = {
    text: string;
    values: any[];
}

class SQLManager{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    pool: Pool.Pool;
    currentBatchId: number;
    queryQueue: queue<query>;


    constructor(host: string, port: number, user: string, password: string, database: string) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        this.database = database;
        this.pool = new Pool({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
        });

        this.currentBatchId = -1;
        this.queryQueue = new queue<query>();
    }

    connect() {
        return this.pool.connect();
    }

    disconnect() {
        return this.pool.end();
    }

    checkConnection() {
        try {
            this.pool.query('SELECT 1');
             this.pool.query('SELECT NOW()');
        } catch (error) {
            console.error(`Error checking connection:`, error);
            throw error;
        }
    }

    genericQuery(query: string, params?: any[]) {
        try{
            return this.pool.query(query, params);
        } catch (error) {
            console.error(`Error executing query:`, error);
            throw error;
        }
    }

    async startBatchQuery(batchName: string) {
        try {
            const query = 'INSERT INTO batches (batch_name, status) VALUES ($1, $2) RETURNING batch_id';
            const response  = await this.pool.query(query, [batchName, 'active']);
            this.currentBatchId = Number(response.rows[0].batch_id);
        } catch (error) {
            console.error(`Error creating batch ${batchName}:`, error);
            throw error;
        }
    }

    async endBatchQuery(endStatus: string) {
        if (this.currentBatchId === -1) {
            throw new Error('No batch is currently active.');
        } else {
            try {
                const query = 'UPDATE batches SET end_time = NOW(), status = $1 WHERE batch_id = $2';
                await this.pool.query(query, [endStatus, this.currentBatchId]);
                this.currentBatchId = -1; // Reset the current batch ID after ending the batch
            } catch (error) {
                console.error(`Error ending batch with ID ${this.currentBatchId}:`, error);
                throw error;
            }
        }
    }

    async booleanParameterQuery(name: string, value: boolean) {
        if (this.currentBatchId === -1) {
            throw new Error('No batch is currently active. Cannot insert boolean parameter.');
        }
        try {
            const query = 'INSERT INTO boolean_parameters (name, value, batch_id) VALUES ($1, $2, $3)';
            await this.pool.query(query, [name, value, this.currentBatchId]);
        } catch (error) {
            console.error(`Error inserting boolean parameter:`, error);
            throw error;
        }
    }

    async stringParameterQuery(name: string, value: string) {
        if (this.currentBatchId === -1) {
            throw new Error('No batch is currently active. Cannot insert string parameter.');
        }
        try {
            const query = 'INSERT INTO string_parameters (name, value, batch_id) VALUES ($1, $2, $3)';
            await this.pool.query(query, [name, value, this.currentBatchId]);
        } catch (error) {
            console.error(`Error inserting string parameter:`, error);
            throw error;
        }
    }

    async numberParameterQuery(name: string, value: number) {
        if (this.currentBatchId === -1) {
            throw new Error('No batch is currently active. Cannot insert number parameter.');
        }
        try {
            const query = 'INSERT INTO number_parameters (name, value, batch_id) VALUES ($1, $2, $3)';
            await this.pool.query(query, [name, value, this.currentBatchId]);
        } catch (error) {
            console.error(`Error inserting number parameter:`, error);
            throw error;
        }
    }


}