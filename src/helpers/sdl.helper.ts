import { SDLService } from './../services/sdl.service';
import Promise = require('tspromise');
import { URLBin } from './../util/url.util';
import { SDLRequest } from './../request/offer.request';
import LoggerUtil from './../logs/log';
import { Component } from './../model/component';
import { ComponentUtil } from './../util/component.util';
import { Offer } from './../response/offer.response';


export class SDL {

    private retentionURL:string;
    private serviceURL:string;
    private messageURL: string;
    private urlBin: URLBin;
    private retention: string[];
    private messages: string[];
    private services: string[];
    private priority: string;
    private cUtil:ComponentUtil;
    private override:boolean = false;
    private default:boolean = false;
    
    constructor(req: SDLRequest){
        this.retention = req.retention;
        this.messages = req.messages;
        this.services = req.services;
        this.override = req.override;
        this.default = req.default;
        this.urlBin = new URLBin(req.languageCode, req.brand, req.offerName);
        this.cUtil = new ComponentUtil();
    }
    
    public readContentFromSDL(): Promise<Component[]> {
        
        this.retentionURL = this.urlBin.buildURL('content');
        this.serviceURL = this.urlBin.buildURL('content');
        this.messageURL = this.urlBin.buildURL('content');
        var sdlService: SDLService = new SDLService(this.override, this.default);
        return null//sdlService.readRetentionPromos();
    }

    /*
        call the SDL with subtopics(http://localhost:8095/gme/cdws/odata.svc/CustomMetas()?&$filter=StringValue eq 'Early Touch' or 
        StringValue eq '001' or StringValue eq 'CEN'&$expand=Component&$format=json) and find the component url in the response.

        filter by all these components and need to expand for the component url. this is not necessary you can build that component presentation url
        with just reading the itemId.

        http://localhost:8095/gme/cdws/odata.svc/Components(ItemId=7102,PublicationId=123)/ComponentPresentations?$format=json

        you get the actual component from this url.

    */
    public readGMEContentFromSDL(): Promise<Offer> {
        
        this.retentionURL = this.urlBin.buildULRForRetentionQuery(this.retention);
        this.serviceURL = this.urlBin.buildULRForServicesQuery(this.services);
        this.messageURL = this.urlBin.buildULRForMessagesQuery(this.messages);
        var sdlService: SDLService = new SDLService(this.override, this.default);
        var p = new Promise((resolve, reject) => {
              Promise.all(this.getPromiseArray(sdlService)).then(fullfilledps => {
                var finalComp = this.getFinalComponent(fullfilledps);
                LoggerUtil.info('final component:::::'+JSON.stringify(finalComp));
                if(undefined != finalComp && '' != finalComp.componentPresUrl && finalComp.componentPresUrl.length > 0){
                    var url = this.urlBin.buildUrlforComponentPresentations(finalComp.componentPresUrl);
                        sdlService.readComponentPersentations(url,finalComp.stringValue).then(s =>{
                            var offer = new Offer();
                            offer.content = s;
                            offer.name =  finalComp.stringValue;
                            offer.page = finalComp.region;
                            resolve(offer);
                        }).catch((e) => {console.log(e.stack)});
                }else{
                    LoggerUtil.info("no components present::::sending empty offer:::");
                    resolve(new Offer());
                }
                }).catch(onRejectPs => {
                    console.log('rejected promises length:::::::::' + onRejectPs);
                    console.error(onRejectPs.stack);
                    reject(new Error(JSON.stringify(onRejectPs.stack)));
                })
        });
        return p;
    }


    public readOverrideContentFromSDL(): Promise<Offer> {
        
        var sdlService: SDLService = new SDLService(true,false);
        var p = new Promise((resolve, reject) => {
              sdlService.readOverirdePromo().then(comp => {
                LoggerUtil.info("component override::::::::"+JSON.stringify(comp));
                var finalComp = comp[0];
                LoggerUtil.info('final component:::::'+JSON.stringify(finalComp));
                if('' != finalComp.componentPresUrl && finalComp.componentPresUrl.length > 0){
                    var url = this.urlBin.buildUrlforComponentPresentations(finalComp.componentPresUrl);
                        sdlService.readComponentPersentations(url,finalComp.stringValue).then(s =>{
                            var offer = new Offer();
                            offer.content = s;
                            offer.name =  finalComp.stringValue;
                            offer.page = finalComp.region;
                            resolve(offer);
                        }).catch((e) => {console.log(e.stack)});
                }else{
                    LoggerUtil.info("no components present::::sending empty offer:::");
                    resolve(new Offer());
                }
                }).catch(onRejectPs => {
                    console.log('rejected promises length:::::::::' + onRejectPs);
                    console.error(onRejectPs.stack);
                    reject(new Error(JSON.stringify(onRejectPs.stack)));
                })
        });
        return p;
    }




    private getPromiseArray(sdlService: SDLService): any[] {

        var promiseArray: any[] = [];
        if(this.override){
            promiseArray.push(sdlService.readOverirdePromo());
        }
        if(this.default){
            promiseArray.push(sdlService.readDefaultPromo());
        }
        if(null != this.services && this.services.length > 0){
            promiseArray.push(sdlService.readServicesPromos(this.serviceURL));
        }
        if(null != this.messages && this.messages.length > 0){
            promiseArray.push(sdlService.readMessagesPromos(this.messageURL));
        }
        if(null != this.retention && this.retention.length > 0){
            promiseArray.push(sdlService.readRetentionPromos(this.retentionURL));
        }
        return promiseArray;

    }


    private getFinalComponent(fullfilledps: any[]): Component {
        
        LoggerUtil.info('fulfilled promises length:::::::::' + fullfilledps.length);
        
        var totalCArray: Component[] = Array<Component>();
        var nextIndex: number = 0;
        if(this.override){
            fullfilledps[nextIndex].forEach((c:any) => totalCArray.push(c));
            nextIndex++;
        }
        if(this.default){
            fullfilledps[nextIndex].forEach((c:any) => totalCArray.push(c));
            nextIndex++;
        }
        if(null != this.services && this.services.length > 0){
            fullfilledps[nextIndex].forEach((c:any) => totalCArray.push(c));
            nextIndex++;
        }
        if(null != this.messages && this.messages.length > 0){
            fullfilledps[nextIndex].forEach((c:any) => totalCArray.push(c));
            nextIndex++;
        }
        if(null != this.retention && this.retention.length > 0){
            fullfilledps[nextIndex].forEach((c:any) => totalCArray.push(c));
            nextIndex++;
        }
        var comp = this.cUtil.sortComponentsByPriorityAndMDate(totalCArray);
        return comp;
    }


    

    
    public readFaqsFromSDL(): Promise<string[]> {
        
        this.retentionURL = this.urlBin.buildURL('faq');
        console.log("This is content::::"+this.retentionURL);
        var sdlService: SDLService = new SDLService(this.override, this.default);
        return sdlService.readFAQs();
    }

}