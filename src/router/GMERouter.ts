import {Router} from 'express';
import LoggerUtil from './../logs/log';
import { GMEContoller } from './../controllers/gme.controller';

export class GMERouter {
    
    router: Router;
    
    constructor() {
        this.router = Router();
        this.init();
    }
    
    init() {
        var gmeController = new GMEContoller();
        this.router.post('/offer', gmeController.readOffer);
        this.router.get('/override', gmeController.readOverideOffer);
        this.router.get('/test', gmeController.testOffer);
        //this.router.post('/faqs', this.readFAQs);
    }
    
}