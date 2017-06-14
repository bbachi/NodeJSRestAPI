import * as request from 'request';
import LoggerUtil from './../logs/log';
import Promise = require('tspromise');
import { Component } from './../model/component';
import * as constant from './../util/constant';
import { ComponentUtil } from './../util/component.util';

export class SDLService {

    private override:boolean = false;
    private default:boolean = false;
    private cUtil:ComponentUtil;

    constructor(override:boolean, def:boolean){
        this.override = override;
        this.default = def;
        this.cUtil = new ComponentUtil();
    }
    
    
    public readRetentionPromos(url: string): Promise<Component[]> {
        
        var p = new Promise((resolve, reject) => {
            request.get(url, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultURL:string = '';
                var cArray: Component[] = new Array<Component>();
                if(response.statusCode == 200 && data.error == undefined){
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                        cArray.push(this.cUtil.createComponentFromSDL(result));
                    });
                    LoggerUtil.info('retentions along with priority length from the SDL::::::'+cArray.length);
                    resolve(cArray);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }


    public readServicesPromos(url: string): Promise<Component[]> {
        
      var p = new Promise((resolve, reject) => {
            request.get(url, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultURL:string = '';
                var cArray: Component[] = new Array<Component>();
                if(response.statusCode == 200 && data.error == undefined){
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                        cArray.push(this.cUtil.createComponentFromSDL(result));
                    });
                    LoggerUtil.info('services along with priority length from the SDL::::::'+cArray.length);
                    resolve(cArray);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }


    public readMessagesPromos(url: string): Promise<Component[]> {
        
        var p = new Promise((resolve, reject) => {
            request.get(url, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultURL:string = '';
                var cArray: Component[] = new Array<Component>();
                if(response.statusCode == 200 && data.error == undefined){
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                        cArray.push(this.cUtil.createComponentFromSDL(result));
                    });
                    LoggerUtil.info('messages along with priority length from the SDL::::::'+cArray.length);
                    resolve(cArray);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }


    public readOverirdePromo(): Promise<Component[]> {
        
        var p = new Promise((resolve, reject) => {
            LoggerUtil.info("url:::::::"+constant.OVERRIDE_URL);
            request.get(constant.OVERRIDE_URL, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultURL:string = '';
                var cArray: Component[] = new Array<Component>();
                if(response.statusCode == 200 && data.error == undefined) {
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                        cArray.push(this.cUtil.createComponentFromSDL(result));
                    });
                    LoggerUtil.info('override promo length from the SDL::::::'+cArray.length);
                    resolve(cArray);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }


     public readDefaultPromo(): Promise<Component[]> {
        
        var p = new Promise((resolve, reject) => {
            request.get(constant.DEFAULT_URL, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultURL:string = '';
                var cArray: Component[] = new Array<Component>();
                if(response.statusCode == 200 && data.error == undefined) {
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                        cArray.push(this.cUtil.createComponentFromSDL(result));
                    });
                    LoggerUtil.info('default promo length from the SDL::::::'+cArray.length);
                    resolve(cArray);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }


  


    public readComponentPersentations(url:string,topic:string): Promise<string> {
        
        var p = new Promise((resolve, reject) => {
            request.get(url, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                var resultHTML:string = '';
                if(response.statusCode == 200 && data.error == undefined){
                    var resBody = JSON.parse(response.body);
                    var results: any[] = resBody.d.results;
                    results.forEach(result => {
                       resultHTML = this.cUtil.checkForDynamicPromos(result.PresentationContent,topic);
                       resultHTML = this.cUtil.checkForImageUrls(resultHTML,topic);
                    });
                    resolve(resultHTML);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }



    public readFAQs(): Promise<string[]> {
        
        LoggerUtil.info('getting the data from FAQs for the url::::');

        var p = new Promise((resolve, reject) => {
            request.get(null, null, (err, response, data) => {
                if(err){
                    reject(new Error(err.toString()));
                }
                var data = JSON.parse(data);
                if(response.statusCode == 200 && data.error == undefined){
                    var presentationContent = JSON.parse(response.body);
                    //LoggerUtil.info(presentationContent.d.results);
                    var results: any[] = presentationContent.d.results;
                    var retStr: string[] = new Array<string>();
                    for(var r=0; r<results.length; r++){
                        retStr.push(results[r].PresentationContent);
                    }
                    resolve(retStr);
                }else{
                    LoggerUtil.info(data.error);
                    reject(new Error(JSON.stringify(data.error)));
                }
            });
        });
        return p;
    }
}