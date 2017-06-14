

interface IRequest {
    
    offerName: string;
    languageCode: string;
    brand: string;
    retention: string[];
    services: string[];
    messages:string[];
    override:boolean;
    default:boolean;
}

export class SDLRequest implements IRequest{

    offerName: string;
    languageCode: string;
    brand: string;
    retention: string[];
    services: string[];
    messages:string[];
    override:boolean = false;
    default:boolean = false;
    
    constructor(reqBody:any) {
        if(null != reqBody){
            this.offerName = reqBody.offerName;
            this.languageCode = reqBody.langCode;
            this.brand = reqBody.brand;
            this.retention = reqBody.retention;
            this.services = reqBody.services;
            this.messages = reqBody.messages;
            this.override = false;
            this.default = true;
        }else{
            this.override = true;
        }
    }
}