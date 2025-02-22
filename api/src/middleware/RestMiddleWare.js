const {RestService} = require("../services/response/responseService");

/* Use This Rest Middle ware in case you wanted to use the REST Api Names 
    Example usage:
    function apiController(req,res){
        res.REST.SERVER_ERROR()
    }
*/
const RestMiddleware = (req, res, next) => {
    res.REST = new RestService(req, res);
    next();
}
module.exports = RestMiddleware;