import * as winston from "winston";
var path = require ('path');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
require('dotenv').load();

export class LoggerUtil {

    logger: winston.LoggerInstance;
    
    constructor(){
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({prettyPrint: true}),
                new (winston.transports.File)({ 
                    filename: "/apps01/logs/nodeJS/sdlAPI/sdlAPI.log", 
                    prettyPrint: true
                }),
                new (winston.transports.DailyRotateFile)({
                    filename: "/apps01/logs/nodeJS/sdlAPI/sdlAPI.log",
                    datePattern: process.env.ROLLING_DATE_PATTERN,
                    prepend: true,
                    prettyPrint: true
                })
            ]
        });
    }

    public info(logText: any, msgType?:string): void{
        this.logger.info(logText);
    }

    public error(logText: any, msgType?:string): void{
        this.logger.error(logText);
    }

    private getDateFormat(): string {
        var date = new Date();
        var returnStr = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        return returnStr;
    }
}

// Create the loggerUtil, and export its instance
const loggerUtil = new LoggerUtil();
export default loggerUtil;