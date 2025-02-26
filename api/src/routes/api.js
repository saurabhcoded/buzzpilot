const api = require('express')();
const acccountRouter = require('./accounts.route');
const connectorRouter = require('./connector.route');
const dashboardRouter = require('./dashboard.route');
const postsRouter = require('./posts.route');

api.get("/", (req, res) => {
    res.send('Hello Node Server🌎 is Working Fine here...');
})
api.use('/posts', postsRouter);
api.use('/dashboard', dashboardRouter);
api.use('/connector', connectorRouter);
api.use('/account', acccountRouter);

module.exports = api