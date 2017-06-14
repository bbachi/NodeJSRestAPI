interface IFaqResponse {
    dataAvailable: boolean;
    errorCode: string;
    errorMessage: string;
    faqs: string[];

    validateResponse(): void;
}

export class FaqResponse implements IFaqResponse {

    dataAvailable: boolean = false;
    errorCode: string;
    errorMessage: string;
    faqs: string[] = new Array<string>();

     validateResponse(): void {
        
        if(null != this.faqs && this.faqs.length > 0){
            this.dataAvailable = true;
        }
    }

}