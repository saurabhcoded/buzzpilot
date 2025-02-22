#!/usr/bin/env node

/**
 * Module dependencies.
 */

const setEnvironmentVariables = require('../src/services/AwsSecretManager');
const clog = require('../src/services/ChalkService.js');
(async () => {
    clog.success('Environment :', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
        clog.success("Setting Secret ENV using AWS Secret Manager");
        await setEnvironmentVariables();
    } else {
        clog.success("Setting Secret ENV using dotenv");
        require("dotenv").config();
    }
    // Continue with other things in app.js

    let app = require('../index.js');
    let debug = require('debug')('whoops-api:server');
    let http = require('http');

    /**
     * Get port from environment and store in Express.
     */

    let port = normalizePort(process.env.PORT || '3012');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port, () => {
        console.log(`🌎 Nodes server running on port : ${port}`)
    });
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
})();