import {Request, Response, NextFunction} from 'express';
import LoggerUtil from './../logs/log';
import { OfferResponse, Offer } from './../response/offer.response';
import { FaqResponse } from './../response/faq.response';
import { SDLRequest } from './../request/offer.request';
import { SDL } from './../helpers/sdl.helper';

export class GMEContoller {
    
    public readOffer(req: Request, res: Response, next: NextFunction) {
        
        LoggerUtil.info('Request body::::'+JSON.stringify(req.body));
        var sdlReq: SDLRequest = new SDLRequest(req.body);
        var resp: OfferResponse = new OfferResponse(req.body);
        resp.validateResponse();
        var sdl = new SDL(sdlReq);
        sdl.readGMEContentFromSDL().then((s:Offer) => {
                resp.offerList.push(s);
                resp.validateResponse();
                LoggerUtil.info('sending response for offer read:::');
                res.send(resp);
            }).catch((e) => {
                console.error(e.stack);
                res.send(e.stack);
            });
    }


    public readOverideOffer(req: Request, res: Response, next: NextFunction) {
        
        var sdlReq: SDLRequest = new SDLRequest(null);
        var resp: OfferResponse = new OfferResponse(req.body);
        resp.validateResponse();
        var sdl = new SDL(sdlReq);
        sdl.readOverrideContentFromSDL().then((s:Offer) => {
                resp.offerList.push(s);
                resp.validateResponse();
                LoggerUtil.info('sending response for offer read:::');
                res.send(resp);
            }).catch((e) => {
                console.error(e.stack);
                res.send(e.stack);
            });
    }

    public testOffer(req: Request, res: Response, next: NextFunction) {

        res.json({dataAvailable:true});

    }
    
}