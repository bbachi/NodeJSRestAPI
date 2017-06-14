import * as constant from './../util/constant';
var fs = require('fs');
import * as sdlConstants from './cdconstants.json';
import LoggerUtil from './../logs/log';

interface IURLParams {
    
    languageCode: string;
    brand: string;
    componentId: string;
    templateId: string;
    itemId:string;
    offerName: string;
    
    buildURL(urlType: string): string;
}


class URLParams implements IURLParams {

     languageCode: string;
     brand: string;
     componentId: string;
     templateId: string;
     itemId:string;
     offerName: string;

     constructor(languageCode: string, brand:string,offerName: string){
        this.languageCode = languageCode;
        this.brand = brand;
        this.offerName = offerName;
        var offers:any[] = (<any>sdlConstants).offers;
        for(var off=0; off<offers.length; off++){
            for (var key in offers[off]) {
                 console.log(key);
                 console.log(offerName);
                 console.log(offers[off][key]);
                 if(key == offerName){
                     var offObj:any = offers[off][key];
                     this.componentId = offObj.ComponentId;
                     this.templateId = offObj.TemplateId;
                 }
            }
        }

       
    }

     public buildURL(urlType: string): string {

        var url: string;
        var publicationId:string;
        if(urlType == 'content'){
            if(this.brand == 'GME') {
                publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.GME_PUB_ID_EN.toString():constant.PUBLISH_ID.GME_PUB_ID_ES.toString();
            }else if(this.brand == 'REL') {
                publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.REL_PUB_ID_EN.toString():constant.PUBLISH_ID.REL_PUB_ID_ES.toString();
            }
            var urlPart = "(PublicationId="+publicationId+",ComponentId="+this.componentId+")";  //",TemplateId="+this.templateId+"
            return constant.BASE_SDL_ODATA_SERV_URL+constant.COMPONENT_PRESENTATIONS+urlPart+constant.PRESENTATION_CONTENT+constant.SDL_RESPONSE_FORMAT;
        }else if(urlType == 'faq'){
            if(this.brand == 'GME') {
                publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.GME_PUB_ID_EN.toString():constant.PUBLISH_ID.GME_PUB_ID_ES.toString();
            }else if(this.brand == 'REL') {
                publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.REL_PUB_ID_EN.toString():constant.PUBLISH_ID.REL_PUB_ID_ES.toString();
            }
            var urlPart = "(ItemId="+this.getItemId(this.offerName)+",PublicationId="+publicationId+")";  //",TemplateId="+this.templateId+"
            return constant.BASE_SDL_ODATA_SERV_URL+constant.COMPONENTS+urlPart+constant.COMPONENT_PRESENTATIONS+constant.SDL_RESPONSE_FORMAT;
        }
    }

    /*
        form url in this way: http://localhost:8095/gme/cdws/odata.svc/CustomMetas()?&$filter=KeyName eq 'Priority' or StringValue eq 'CEN'&$expand=Component&$format=json
        
        StringValue is the key for all Topic, subTopic, Category and Priority

        the above url is built with the incoing subtopic array ["CEN","Early Touch"] and priority 001

    */
    public buildULRForRetentionQuery(retentions: string[]): string {

        var url: string;
        var publicationId:string;
         if(this.brand == 'GME') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.GME_PUB_ID_EN.toString():constant.PUBLISH_ID.GME_PUB_ID_ES.toString();
         }else if(this.brand == 'REL') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.REL_PUB_ID_EN.toString():constant.PUBLISH_ID.REL_PUB_ID_ES.toString();
         }
         var urlPart: string = '';
         if(null != retentions && undefined != retentions && retentions.length > 0){
            var subTopicCount = retentions.length;
            retentions.forEach((subTopic,index) =>{
                var stringVal: string = constant.STRING_VALUE;
                var subTopc: string = subTopic;
                var urlPart1: string = stringVal+"'"+subTopc+"'";
                var urlPart2: string = (subTopicCount-1) != index?' '+constant.OR+' ':'';
                urlPart = urlPart+urlPart1+urlPart2;
            });
            url = constant.BASE_SDL_ODATA_SERV_URL+constant.CUSTOM_META+'?&'+constant.FILTER+
                constant.KEY_NAME_PRIORITY+' '+constant.OR+' '+constant.KEY_NAME_REGION+' '+constant.OR+' '+urlPart+constant.AND+constant.EXPAND+
                constant.COMPONENT+constant.AND+constant.SDL_RESPONSE_FORMAT
            LoggerUtil.info("built retention query:::"+url+"::for the retentions:::::"+JSON.stringify(retentions));
         }else{
             url = '';
             LoggerUtil.info("retentions are empty in the request hence sending empty url");
         }
         return url;
    }

    
    public buildULRForServicesQuery(services: string[]): string {

        var url: string;
        var publicationId:string;
         if(this.brand == 'GME') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.GME_PUB_ID_EN.toString():constant.PUBLISH_ID.GME_PUB_ID_ES.toString();
         }else if(this.brand == 'REL') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.REL_PUB_ID_EN.toString():constant.PUBLISH_ID.REL_PUB_ID_ES.toString();
         }
         var urlPart: string = '';
         if(null != services && undefined != services && services.length > 0){
            var subTopicCount = services.length;
            services.forEach((service,index) =>{
                var stringVal: string = constant.STRING_VALUE;
                var subTopc: string = service;
                var urlPart1: string = stringVal+"'"+subTopc+"'";
                var urlPart2: string = (subTopicCount-1) != index?' '+constant.OR+' ':'';
                urlPart = urlPart+urlPart1+urlPart2;
            });
            url = constant.BASE_SDL_ODATA_SERV_URL+constant.CUSTOM_META+'?&'+constant.FILTER+constant.KEY_NAME_PRIORITY+' '+constant.OR+' '+urlPart+constant.AND+constant.EXPAND+constant.COMPONENT+constant.AND+constant.SDL_RESPONSE_FORMAT
            LoggerUtil.info("built services query:::"+url+"::for the services:::::"+JSON.stringify(services));
         }else{
             url = '';
             LoggerUtil.info("services are empty in the request hence sending empty url");
         }
         return url;
    }


    public buildULRForMessagesQuery(messages: string[]): string {

        var url: string;
        var publicationId:string;
         if(this.brand == 'GME') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.GME_PUB_ID_EN.toString():constant.PUBLISH_ID.GME_PUB_ID_ES.toString();
         }else if(this.brand == 'REL') {
            publicationId = (this.languageCode == 'EN')?constant.PUBLISH_ID.REL_PUB_ID_EN.toString():constant.PUBLISH_ID.REL_PUB_ID_ES.toString();
         }
         var urlPart: string = '';
         if(null != messages && undefined != messages && messages.length > 0){
            var subTopicCount = messages.length;
            messages.forEach((service,index) =>{
                var stringVal: string = constant.STRING_VALUE;
                var subTopc: string = service;
                var urlPart1: string = stringVal+"'"+subTopc+"'";
                var urlPart2: string = (subTopicCount-1) != index?' '+constant.OR+' ':'';
                urlPart = urlPart+urlPart1+urlPart2;
            });
            url = constant.BASE_SDL_ODATA_SERV_URL+constant.CUSTOM_META+'?&'+constant.FILTER+constant.KEY_NAME_PRIORITY+' '+constant.OR+' '+urlPart+constant.AND+constant.EXPAND+constant.COMPONENT+constant.AND+constant.SDL_RESPONSE_FORMAT
            LoggerUtil.info("built messages query:::"+url+"::for the messages:::::"+JSON.stringify(messages));
         }else{
             url = '';
             LoggerUtil.info("messages are empty in the request hence sending empty url");
         }
         return url;
    }


    public buildUrlforComponentPresentations(url: string): string {
        if('' != url){
            return url+constant.COMPONENT_PRESENTATIONS+"?"+constant.SDL_RESPONSE_FORMAT;
        }else{
            return '';
        }
    }


    private getItemId(progName: string): string {

        var faqs:any[] = (<any>sdlConstants).faqs;
        for(var faq=0; faq<faqs.length; faq++){
            for (var key in faqs[faq]) {
                if(key == progName){
                    return faqs[faq][key].ItemId;
                }
            }
        }
    }

}


export class URLBin extends URLParams {

   constructor(languageCode: string, brand:string, offerName: string){
       super(languageCode,brand, offerName);
   }

}