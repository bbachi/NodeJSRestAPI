import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { GMERouter } from './src/router/GMERouter';

class App {
    
    public express: express.Application;
    public gmeRouter: GMERouter = new GMERouter();
    
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.gmeRouter.init();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
        * working so far. This function will change when we start to add more
        * API endpoints */
        let contentAPIRouter = express.Router();
        // placeholder route handler
        contentAPIRouter.get('/', (req, res, next) => {
            res.json('This is testing8');
        });
        this.express.use('/', contentAPIRouter);
        this.express.use('/gme', this.gmeRouter.router);
    }
}

export default new App().express;