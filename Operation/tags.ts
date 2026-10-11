import { OPCUAClient, AttributeIds, DataType } from "node-opcua";

abstract class abstractTag {
    defaultValue: any;
    options?: any[];

    constructor(    public name: string, 
                    public description: string, 
                    public type: string) {

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

    abstract getValueFromClient(client: OPCUAClient, nodeId: string): Promise<any>;
    
    
}

class triggerTag extends abstractTag {
    constructor(name: string, 
                description: string) {
        super(name, description, 'trigger');
    }

    getValueFromClient(client: OPCUAClient, nodeId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}

abstract class abstractMeasurementTag extends abstractTag {
    triggerTag: booleanTag;

    constructor(name: string, 
                description: string, 
                type: string,
                triggerTag: booleanTag) {
        super(name, description, type);
        this.triggerTag = triggerTag;
    }
}

class booleanTag extends abstractMeasurementTag {

    defaultValue: boolean;

    constructor(name: string, 
                description: string, 
                defaultValue: boolean, 
                triggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'boolean', triggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    getValueFromClient(client: OPCUAClient, nodeId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}

class stringTag extends abstractMeasurementTag {
    defaultValue: string;

    constructor(name: string, 
                description: string, 
                defaultValue: string, 
                triggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'string', triggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<string> {
        return Promise.resolve("");
    }


}

class numberTag extends abstractMeasurementTag {
    defaultValue: number;

    constructor(name: string, 
                description: string, 
                defaultValue: number, 
                triggerTag: booleanTag, 
                options?: any[]) {
        super(name, description, 'number', triggerTag);
        this.defaultValue = defaultValue;
        this.options = options;
    }

    async getValueFromClient(client: OPCUAClient, nodeId: string): Promise<number> {
        return Promise.resolve(0);
    }
}

class TagFactory {
    static createTag(name: string, 
                     description: string,
                     type: string, 
                     defaultValue: any, 
                     myTriggerTag: booleanTag, 
                     options?: any[]) {
        switch (type) {
            case 'boolean':
                return new booleanTag(name, description, defaultValue, myTriggerTag, options);
            case 'string':
                return new stringTag(name, description, defaultValue, myTriggerTag, options);
            case 'number':
                return new numberTag(name, description, defaultValue, myTriggerTag, options);
            case 'trigger':
                return new triggerTag(name, description);
            default:
                throw new Error(`Unsupported tag type: ${type}`);
        }
    }
}