import * as http from 'http';
import * as debug from 'debug';
import App from './app';
import path = require('path');
var cluster = require('cluster');

const port = normalizePort(process.env.PORT || 3080);

if(cluster.isMaster){
  
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }

  cluster.on('exit', function (worker:any) {
    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
});

}else{
  App.set('port', port);
  const server = http.createServer(App);
  server.listen(port);
  server.on('error', function(error: NodeJS.ErrnoException): void {
      if (error.syscall !== 'listen') throw error;
      let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
      switch(error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
    }
  });
  server.on('listening', function(): void {
      let addr = server.address();
      let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
      debug(`Listening on ${bind}`);
        console.log(`Listening on ${bind}`);
      });
  console.log('Worker %d running!', cluster.worker.id);
}



function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

module.exports = App;