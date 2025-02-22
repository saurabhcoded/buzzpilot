const helmet = require("helmet");
const cors = require("cors");
const { commonConfig } = require("../config/config");

const SecurityMiddleware = (app) => {
  app.use(helmet());
  let allowedOrigins = ["localhost"];
  if (commonConfig.allowedCors) {
    allowedOrigins = commonConfig.allowedCors.split(",");
  }
  app.use(cors({
      origin: allowedOrigins
  }))
  /* TODO: Add Allowed Cors Url to allowlist */
  console.log("Allowed Origins", allowedOrigins);
  // referrer policy
  app.use(
    helmet.referrerPolicy({
      policy: "no-referrer"
    })
  );
  // not loading the noSniff() middleware
  app.use(
    helmet({
      noSniff: false
    })
  );
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization,currentPage"
    );
    res.header("X-Frame-Options", "DENY");
    res.header("Content-Security-Policy", "frame-ancestors 'none'");
    next();
  });
};
module.exports = SecurityMiddleware;
