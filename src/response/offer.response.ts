interface IOffer{
    programId: string;
    content: string;
    name: string;
    page: string;
}

interface IOfferResponse{
    dataAvailable: boolean;
    errorCode: string;
    errorMessage: string;
    companyCode: string;
    brandId: string;
    offerList: IOffer[];
    page: string;

    validateResponse(): void;
}


export class Offer implements IOffer {
    programId: string;
    content: string;
    name: string;
    page: string;
}

export class OfferResponse implements IOfferResponse {

    constructor(requestBody: any){
        this.brandId = requestBody.brandId;
        this.companyCode = requestBody.companyCode;
    }

    dataAvailable: boolean = false;
    errorCode: string;
    errorMessage: string;   
    companyCode: string;
    brandId: string;
    offerList: IOffer[]  = new Array<IOffer>();
    page: string;

    validateResponse(): void {
        console.log(this.offerList);
        if(undefined != this.offerList && this.offerList.length > 0){
            this.offerList.forEach(o => {
                console.log(o);
                if(undefined != o && undefined != o.content && o.content.length > 0){
                    this.dataAvailable = true;
                }
            });
        }
    }


}