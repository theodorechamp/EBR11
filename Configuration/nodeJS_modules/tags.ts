import { OPCUAClient, AttributeIds, DataType } from "node-opcua";

abstract class abstractTag {
    //name: string;
    //description: string;
    //type: string;
    defaultValue: any;
    options?: any[];
    //measurementTriggerTag: booleanTag;

    constructor(    public name: string, 
                    public description: string, 
                    public type: string, 
                    public measurementTriggerTag: booleanTag) {

    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getType(): string {
        return this.type;
    }

    public getoptions(): any[] | undefined {
        return this.options;
    }

    public addOption(option: any): any[] {
        if (!this.options) {
            this.options = [];
        }
        this.options.push(option);
        return this.options;
    }

    public getMeasurementTriggerTag(): booleanTag {
        return this.measurementTriggerTag;
    }

    abstract async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<any>;
    
    
}

class booleanTag extends abstractTag {

    defaultValue: boolean;

    constructor(name: string, 
                description: string, 
                defaultValue: boolean, 
                measurementTriggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'boolean', measurementTriggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<string> {
        return '';
    }
}

class stringTag extends abstractTag {
    defaultValue: string;

    constructor(name: string, 
                description: string, 
                defaultValue: string, 
                measurementTriggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'string', measurementTriggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<string> {
        return '';
    }


}

interface numberTag extends abstractTag {
    defaultValue: number;

    constructor(name: string, 
                description: string, 
                defaultValue: number, 
                measurementTriggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'number', measurementTriggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<string> {
        return '';
    }
}

class TagManager {

}