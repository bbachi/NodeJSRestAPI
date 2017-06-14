import { Component } from './../model/component';
import LoggerUtil from './../logs/log';
import * as constant from './../util/constant';
import * as sdlConstants from '../util/cdconstants.json';

export class ComponentUtil {

    public createComponentFromSDL(result: any): Component{

        var c = new Component();
        c.author = result.Component.Author;
        c.componentPresUrl = result.Component.__metadata.uri;
        c.createdDate = result.Component.CreationDate;
        c.itemId = result.Component.ItemId;
        c.itemType = result.ItemType;
        c.keyName = result.KeyName;
        var convertDate = (result.Component.ModificationDate.substring(6,result.Component.ModificationDate.length-2)).split('-')[0];
        c.modifyDate = new Date(parseInt(convertDate));
        c.publicationId = result.PublicationId;
        c.stringValue = result.StringValue;
        c.title = result.Component.Title;
        return c;
    }


    public sortComponentsByPriorityAndMDate(cArray: Component[]): Component {
        //assigning priority for each component
        try{
            if(cArray.length > 0){
                LoggerUtil.info("total component lentgh from SDL along with priority:::::::"+cArray.length);
            }else{
                LoggerUtil.info("no components found after all calls:::::::"+cArray.length);
                return new Component();
            }
            var priorArray = this.assignPriorityToEachComponent(cArray);
            //assigning region for each component
            LoggerUtil.info("component length after sorting priority:::"+priorArray.length);
            var priorArray = this.assignRegionToEachComponent(priorArray);
            LoggerUtil.info("component length after sorting region:::"+priorArray.length);
            //sorting by priority
            priorArray.sort((a,b) => {
                //var pA = isNaN(parseInt(a.stringValue))?0:parseInt(a.stringValue);
                //var pB = isNaN(parseInt(b.stringValue))?0:parseInt(b.stringValue);
                return (a.priority > b.priority)?1:(a.priority < b.priority)?-1:0
            });
        }catch(ex){
            LoggerUtil.error('exception occured while sortComponentsByPriorityAndMDate:::'+ex);
        }
        return this.getHighestPriority(priorArray);
    }


    //separting the logic from the priority
    public assignPriorityToEachComponent(cArray: Component[]) :Component[]{

        var nonPriorityCArray = new Array<Component>();
        var priorityCArray = new Array<Component>();
        cArray.forEach((c) => {
            if(isNaN(parseInt(c.stringValue))){
                nonPriorityCArray.push(c);
            }else{
                priorityCArray.push(c);
            }
            if(!isNaN(parseInt(c.stringValue))){
                c.priority = parseInt(c.stringValue);
            }
        });

       nonPriorityCArray.forEach(np => {
            priorityCArray.forEach(p => {
                if(np.itemId === p.itemId){
                    np.priority = parseInt(p.stringValue);
                }
            });
        });
        return nonPriorityCArray;
    }


    //separting the logic from the region
    public assignRegionToEachComponent(cArray: Component[]) :Component[]{

        var nonRegionCArray = new Array<Component>();
        var regionCArray = new Array<Component>();
        cArray.forEach((c) => {
            if(c.keyName === constant.REGION){
                c.region = c.stringValue;
                regionCArray.push(c);
            }else{
                nonRegionCArray.push(c);
            }
        });

       nonRegionCArray.forEach(nr => {
            regionCArray.forEach(r => {
                if(nr.itemId === r.itemId){
                    nr.region = r.region;
                }
            });
        });
        return nonRegionCArray;
    }

    /*
    * a)check for the override keyname and if exist and 'Yes' return that component
      b)sort by priority if one component has the highest priority return that component
      c)check if multiple components has the same priority if yes--sort by modified date and return the lastest one
    */
    public getHighestPriority(cArray: Component[]): Component{

        var c = new Component();
        var overideFound:boolean = false;
        cArray.forEach(a => {
            if(a.keyName === constant.KEY_OVERRIDE && a.stringValue === constant.YES){
                LoggerUtil.info('found override promo::sent back override:::::');
                c=a;
                overideFound =true;
            }
        });
        if(!overideFound){
            c = this.sortByPriorityAndModifyDate(cArray,c);
        }
        LoggerUtil.info('returning:::::component::'+JSON.stringify(c));
        return c;
    }


    public sortByPriorityAndModifyDate(cArray: Component[], c: Component): Component {
        
        try{
            var highestPriority:number = 0;
            for(let a of cArray){
                highestPriority = isNaN(a.priority)?0:a.priority;
                if(highestPriority !== 0){break;}
            }
            LoggerUtil.info('highest priority:::::::'+highestPriority);
            var samePriorityArry: Component[] = [];
            cArray.forEach(a => {
                if(a.priority === highestPriority){
                    samePriorityArry.push(a);
                }
            });
            LoggerUtil.info('same priority length:::::::'+samePriorityArry.length);
            if(samePriorityArry.length > 1){
                LoggerUtil.info("sorting by latest modification date::::");
                samePriorityArry.sort((a,b) => {
                    return (a.modifyDate > b.modifyDate)?-1:(a.modifyDate < b.modifyDate)?1:0
                });
            }
            c = samePriorityArry[0];
        }catch(ex){
            LoggerUtil.info('error occured while sortByPriorityAndModifyDate:::'+ex);
        }
        return c;
    }   


    public checkForDynamicPromos(html: string,topic:string): string {
        
        var returnHtml: string = html;
        try{
            if(html.indexOf("%%") !== -1){ //if dynamic values contains in the html insert the values from cdconstants.json file
                var dynamicAry = this.getDynamicPromos(topic);
                LoggerUtil.info(topic+" html contains some dynamic stuff::::need to replace with the values::"+JSON.stringify(dynamicAry));
                dynamicAry.forEach((dynamicKey) => {
                    for (var key in dynamicKey) {
                        html = html.replace("%%"+key+"%%",dynamicKey[key]);
                    }
                });
                returnHtml = html;
            }
        }catch(ex){
            LoggerUtil.error('error occured while checkForDynamicPromos:::'+ex);
        }
        return returnHtml;
    }


     public checkForImageUrls(html: string,topic:string): string {
        
        var returnHtml: string = html;
        try{
            if(html.indexOf("<img") !== -1){ //if promo content contains the image prepend hostinfo from properties file
                var imageHost = constant.ENVIRONMENT_CONFIG.imageHost;
                var count = (html.match(/<img/g) || []).length;
                LoggerUtil.info(topic+" html contains some images::::prepending image host info to each image::::"+imageHost+"::::total images found in the content:::"+count);
                for(var i=0; i<count; i++){
                    var htmlAry = html.split('<img src="');
                    console.log(htmlAry[0]);
                    console.log(htmlAry[1]);
                    html = htmlAry[0]+'<img src="'+imageHost+htmlAry[1];
                }
                returnHtml = html;
            }
        }catch(ex){
            LoggerUtil.error('error occured while checkForImageUrls:::'+ex);
        }
        return returnHtml;
    }


    public getDynamicPromos(keyIn: string): any[]{
        
        var offers:any[] = (<any>sdlConstants).dynamicpromos;
        for(var off=0; off<offers.length; off++){
            for (var key in offers[off]) {
                if(key == this.trimAndLower(keyIn)){
                    return offers[off][key];
                }
            }
        }
    }

    public trimAndLower(val: string) {
        return val.replace(/ /g, '').toLocaleLowerCase();
    }

}